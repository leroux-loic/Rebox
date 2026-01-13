"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Container, VStack, Heading, Text, Button, Icon, Box } from "@chakra-ui/react"
import { CheckCircle, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"

import { Suspense } from "react"

function CheckoutSuccessContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { user } = useAuth()
    const sessionId = searchParams.get('session_id')
    const [loading, setLoading] = useState(true)

    const [pickupCode, setPickupCode] = useState<string | null>(null)

    useEffect(() => {
        const finalizeOrder = async () => {
            if (sessionId && user) {
                try {
                    const code = Math.random().toString(36).substring(2, 8).toUpperCase()

                    // Call the secure RPC function
                    const { data, error } = await (supabase as any).rpc('complete_payment', {
                        p_session_id: sessionId,
                        p_pickup_code: code
                    })

                    if (error) {
                        console.error("RPC Error:", error)
                        return
                    }

                    // If already processed, we might want to fetch the code from the order
                    // But for now, if success, we show the generated code or fetch it
                    if (data && (data as any).success) {
                        setPickupCode(code)
                    }
                } catch (err) {
                    console.error("Error finalizing order:", err)
                } finally {
                    setLoading(false)
                }
            }
        }

        finalizeOrder()
    }, [sessionId, user])

    return (
        <Container maxW="container.md" py={20}>
            <VStack spacing={8} textAlign="center">
                <Icon as={CheckCircle} w={20} h={20} color="green.500" />
                <Heading>Paiement réussi !</Heading>
                <Text fontSize="lg" color="gray.600">
                    Merci pour votre commande. Votre transaction a été validée.
                </Text>

                {pickupCode && (
                    <Box p={6} bg="green.50" borderRadius="lg" w="full" border="1px dashed" borderColor="green.300">
                        <Text fontWeight="bold" color="green.800" mb={2}>CODE DE RETRAIT</Text>
                        <Heading size="xl" color="green.600" letterSpacing="widest">{pickupCode}</Heading>
                        <Text fontSize="sm" mt={2} color="green.700">A présenter au vendeur</Text>
                    </Box>
                )}

                <Box p={6} bg="gray.50" borderRadius="lg" w="full">
                    <Text fontWeight="bold" mb={2}>Prochaines étapes :</Text>
                    <Text>Le vendeur a été notifié. Vous pouvez retrouver ce code dans votre tableau de bord.</Text>
                </Box>

                <Button
                    colorScheme="brand"
                    size="lg"
                    rightIcon={<Icon as={ArrowRight} />}
                    onClick={() => router.push('/dashboard/individual')}
                >
                    Aller au tableau de bord
                </Button>
            </VStack>
        </Container>
    )
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Finalisation du paiement...</div>}>
            <CheckoutSuccessContent />
        </Suspense>
    )
}
