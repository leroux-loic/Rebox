"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Box, Button, FormControl, FormLabel, Heading, Input, Text, VStack, useToast, Container, Alert, AlertIcon, Radio, RadioGroup, Stack } from "@chakra-ui/react"
import Link from "next/link"

export default function SignupPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState<"company" | "individual">("individual")
    const [companyName, setCompanyName] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const toast = useToast()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // 1. Sign up user with metadata
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    role: role,
                    company_name: role === 'company' ? companyName : null,
                }
            }
        })

        if (authError) {
            setError(authError.message)
            setLoading(false)
            return
        }

        if (authData.user) {
            toast({
                title: "Inscription réussie",
                description: "Veuillez vérifier votre email ou vous connecter.",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
            router.push('/login?message=Inscription réussie ! Connectez-vous.')
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
                <VStack spacing={6} as="form" onSubmit={handleSignup}>
                    <VStack spacing={2} textAlign="center">
                        <Heading size="lg">Inscription</Heading>
                        <Text color="gray.500">Rejoignez la communauté ReBox</Text>
                    </VStack>

                    {error && (
                        <Alert status="error" rounded="md">
                            <AlertIcon />
                            {error}
                        </Alert>
                    )}

                    <FormControl as="fieldset">
                        <FormLabel as="legend">Je suis...</FormLabel>
                        <RadioGroup defaultValue="individual" onChange={(v) => setRole(v as any)} value={role}>
                            <Stack direction="row" spacing={4}>
                                <Radio value="individual">Un Particulier</Radio>
                                <Radio value="company">Une Entreprise</Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>

                    {role === 'company' && (
                        <FormControl id="companyName" isRequired>
                            <FormLabel>Nom de l'entreprise</FormLabel>
                            <Input
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </FormControl>
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
                        S'inscrire
                    </Button>

                    <Text fontSize="sm" color="gray.600">
                        Déjà un compte ?{" "}
                        <Link href="/login" style={{ color: 'var(--chakra-colors-brand-600)', fontWeight: 'bold' }}>
                            Se connecter
                        </Link>
                    </Text>
                </VStack>
            </Box>
        </Container>
    )
}
