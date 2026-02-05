'use server'

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { signIn, signOut } from '@/app/auth';
import { AuthError } from 'next-auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.date(),
})

// Omit id and date from the schema
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// Create invoice
export async function createInvoice(formData: FormData) {

    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;

        revalidatePath('/dashboard/invoices');
        redirect('/dashboard/invoices');
    } catch (error) {
        console.error(error);
        return {
            message: 'Database error: Failed to create invoice',
        }
    }
}

// Update invoice
export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;

    try {

        await sql`
            UPDATE invoices
            SET customer_id = ${customerId},
                amount = ${amountInCents},
                status = ${status}
            WHERE id = ${id}
        `;

    } catch (error) {
        console.error(error);
        return {
            message: 'Database error: Failed to update invoice',
        }
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {

    await sql`
        DELETE FROM invoices
        WHERE id = ${id}
    `;

    revalidatePath('/dashboard/invoices');
}


import { auth } from '@/app/auth';

export async function triggerDianRpa(formData: FormData) {
    const session = await auth();
    const token = (session?.user as any)?.accessToken;

    const data = {
        start_date: formData.get('startDate'),
        end_date: formData.get('endDate'),
        type_document: formData.get('typeDocument'),
        token_dian: formData.get('token'),
    };

    console.log('Triggering RPA with data:', data);

    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${process.env.API_BASE_URL}/api/v1/dian/download/type/documents`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error en backend: ${errorText}`);
        }

        const responseData = await response.json();
        return {
            message: 'RPA Triggered successfully',
            taskId: responseData.task_id
        };

    } catch (error) {
        console.error('Failed to trigger RPA:', error);
        return { message: 'Failed to trigger RPA' };
    }
}

export async function getRPATaskStatus(taskId: number) {
    const session = await auth();
    const token = (session?.user as any)?.accessToken;

    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${process.env.API_BASE_URL}/api/v1/tasks/${taskId}/status`, {
            cache: 'no-store',
            headers: headers
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data; // Returns TaskStatus
    } catch (error) {
        console.error('Error fetching task status:', error);
        return null;
    }
}


export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function logout() {
    await signOut({ redirectTo: '/login' });
}

export async function uploadPuc(formData: FormData) {
    const session = await auth();
    const token = (session?.user as any)?.accessToken;

    try {
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        // Note: Do NOT set Content-Type header when sending FormData, fetch sets it automatically with boundary

        const response = await fetch(`${process.env.API_BASE_URL}/api/v1/puc/upload`, {
            method: 'POST',
            body: formData,
            headers: headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            // Intentar parsear JSON si es posible
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.detail || errorText);
            } catch {
                throw new Error(`Error al cargar PUC: ${errorText}`);
            }
        }

        const data = await response.json();
        revalidatePath('/dashboard/carga-listado-puc');
        return { message: data.message, success: true };

    } catch (error: any) {
        console.error('Failed to upload PUC:', error);
        return { message: error.message || 'Failed to upload PUC', success: false };
    }
}


// --- AUTH FEATURES ---

const RegisterSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3),
    full_name: z.string().min(1),
    password: z.string().min(6),
});

export async function registerUser(prevState: any, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse({
        email: formData.get('email'),
        username: formData.get('username'),
        full_name: formData.get('full_name'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Register.'
        };
    }

    const { email, username, full_name, password } = validatedFields.data;

    try {
        const response = await fetch(`${process.env.API_BASE_URL}/api/v1/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, full_name, password })
        });

        if (!response.ok) {
            const errorText = await response.text();
            // Try to parse JSON error
            try {
                const errorJson = JSON.parse(errorText);
                return { message: errorJson.detail || 'Registration failed.' };
            } catch {
                return { message: `Registration Failed: ${errorText}` };
            }
        }
    } catch (error) {
        console.error('Registration Error:', error);
        return { message: 'Failed to Register user. Network error?' };
    }

    redirect('/login?registered=true');
}

const ForgotPasswordSchema = z.object({
    email: z.string().email()
});

export async function forgotPassword(prevState: any, formData: FormData) {
    const validatedFields = ForgotPasswordSchema.safeParse({
        email: formData.get('email'),
    });

    if (!validatedFields.success) {
        return { message: 'Invalid email address.' };
    }

    try {
        const response = await fetch(`${process.env.API_BASE_URL}/api/v1/users/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: validatedFields.data.email })
        });

        if (!response.ok) {
            return { message: 'Failed to request password reset.' };
        }

        return { message: 'If your email is registered, you will receive a password reset link.', success: true };

    } catch (error) {
        return { message: 'Failed to request password reset.' };
    }
}

const ResetPasswordSchema = z.object({
    new_password: z.string().min(6),
    confirm_password: z.string().min(6),
    token: z.string()
}).refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
});

export async function resetPassword(prevState: any, formData: FormData) {
    const validatedFields = ResetPasswordSchema.safeParse({
        new_password: formData.get('new_password'),
        confirm_password: formData.get('confirm_password'),
        token: formData.get('token'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Validation failed.'
        };
    }

    try {
        const response = await fetch(`${process.env.API_BASE_URL}/api/v1/users/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: validatedFields.data.token,
                new_password: validatedFields.data.new_password
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { message: `Reset Failed: ${errorText}` };
        }

    } catch (error) {
        return { message: 'Failed to reset password.' };
    }

    redirect('/login?reset=true');
}