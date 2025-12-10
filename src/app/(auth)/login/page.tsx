"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Box, Button, FormControl, FormLabel, Heading, Input, Text, VStack, useToast, Container, Alert, AlertIcon } from "@chakra-ui/react"
import Link from "next/link"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const toast = useToast()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
            toast({
                title: "Erreur de connexion",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        } else {
            // Check user role and redirect accordingly
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()

                const userProfile = profile as { role: 'company' | 'individual' } | null

                toast({
                    title: "Connexion réussie",
                    status: "success",
                    duration: 3000,
                })

                if (userProfile?.role === 'company') {
                    router.push('/dashboard/company')
                } else {
                    router.push('/dashboard/individual')
                }
            }
        }
    }

    return (
        <Container maxW="lg" py={{ base: 12, md: 24 }} px={{ base: 0, sm: 8 }}>
            <Box
                bg="white"
                py="8"
                px={{ base: 4, md: 10 }}
                shadow="base"
                rounded={{ sm: 'lg' }}
            >
                <VStack spacing={6} as="form" onSubmit={handleLogin}>
                    <VStack spacing={2} textAlign="center">
                        <Heading size="lg">Connexion</Heading>
                        <Text color="gray.500">Connectez-vous à votre compte ReBox</Text>
                    </VStack>

                    {error && (
                        <Alert status="error" rounded="md">
                            <AlertIcon />
                            {error}
                        </Alert>
                    )}

                    <FormControl id="email" isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            placeholder="exemple@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>

                    <FormControl id="password" isRequired>
                        <FormLabel>Mot de passe</FormLabel>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>

                    <Button
                        type="submit"
                        colorScheme="brand"
                        size="lg"
                        fontSize="md"
                        w="full"
                        isLoading={loading}
                    >
                        Se connecter
                    </Button>

                    <Text fontSize="sm" color="gray.600">
                        Pas encore de compte ?{" "}
                        <Link href="/signup" style={{ color: 'var(--chakra-colors-brand-600)', fontWeight: 'bold' }}>
                            S'inscrire
                        </Link>
                    </Text>
                </VStack>
            </Box>
        </Container>
    )
}
