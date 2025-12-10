
const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const path = require('path')

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testLogin(email, password) {
    console.log(`Testing login for ${email}...`)
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error(`Login failed: ${error.message}`)
    } else {
        console.log(`Login successful! User ID: ${data.user.id}`)
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single()

        if (profile) {
            console.log(`User Role: ${profile.role}`)
        } else {
            console.error(`Profile fetch failed: ${profileError?.message}`)
        }
    }
}

async function main() {
    await testLogin('natsei.pro@gmail.com', 'AdminAdmin')
}

main()
