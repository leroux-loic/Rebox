"use client"

import { useRouter } from "next/navigation"
import { Container, VStack, Heading, Text, Button, Icon } from "@chakra-ui/react"
import { XCircle, ArrowLeft } from "lucide-react"

export default function CheckoutCancelPage() {
    const router = useRouter()

    return (
        <Container maxW="container.md" py={20}>
            <VStack spacing={8} textAlign="center">
                <Icon as={XCircle} w={20} h={20} color="red.500" />
                <Heading>Paiement annulé</Heading>
                <Text fontSize="lg" color="gray.600">
                    Vous avez annulé le processus de paiement. Aucun montant n'a été débité.
                </Text>

                <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<Icon as={ArrowLeft} />}
                    onClick={() => router.back()}
                >
                    Retourner à l'annonce
                </Button>
            </VStack>
        </Container>
    )
}
