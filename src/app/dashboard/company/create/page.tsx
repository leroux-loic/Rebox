"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { Button, Box, Container, Flex, Heading, Input, Textarea, Progress, SimpleGrid, Text, VStack, Icon, useToast, FormControl, FormLabel, Select } from "@chakra-ui/react"
import { ArrowLeft, ArrowRight, Package, MapPin, Camera, Euro, CheckCircle } from "lucide-react"
import Link from "next/link"

const STEPS = [
    { title: "Catégorie", icon: Package },
    { title: "Détails", icon: Text },
    { title: "Dimensions", icon: Package },
    { title: "Prix & Photo", icon: Euro },
    { title: "Localisation", icon: MapPin },
]

export default function CreateListingWizard() {
    const { user } = useAuth()
    const router = useRouter()
    const toast = useToast()
    const [step, setStep] = useState(0)
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Moyens Cartons", // Default
        price: "",
        quantity: "",
        length: "",
        width: "",
        height: "",
        location_lat: 48.8566,
        location_lng: 2.3522,
        addressString: "",
        image_url: "",
    })

    const handleNext = () => setStep(prev => Math.min(prev + 1, STEPS.length - 1))
    const handlePrev = () => setStep(prev => Math.max(prev - 1, 0))

    const handleSubmit = async () => {
        if (!user) return
        setLoading(true)

        // Construct dimensions string
        const dimensionsStr = `${formData.length}x${formData.width}x${formData.height} cm`

        const { error } = await supabase
            .from('listings')
            .insert({
                seller_id: user.id,
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity),
                dimensions: dimensionsStr,
                length: parseInt(formData.length || '0'),
                width: parseInt(formData.width || '0'),
                height: parseInt(formData.height || '0'),
                location_lat: formData.location_lat,
                location_lng: formData.location_lng,
                image_url: formData.image_url,
                status: 'active'
            } as any)

        if (error) {
            toast({ title: "Erreur", description: error.message, status: "error" })
            setLoading(false)
        } else {
            // Notification
            await (supabase.from('notifications') as any).insert({
                user_id: user.id,
                title: "Annonce créée !",
                message: `Votre annonce "${formData.title}" est en ligne.`,
                type: "success"
            })

            toast({ title: "Succès !", description: "Votre annonce a été publiée.", status: "success" })
            router.push('/dashboard/company')
        }
    }

    const StepCategory = () => (
        <VStack spacing={6} align="stretch">
            <Heading size="md">Quel type de cartons vendez-vous ?</Heading>
            <SimpleGrid columns={2} spacing={4}>
                {["Petits Cartons", "Moyens Cartons", "Grands Cartons", "Kits Déménagement", "Palettes", "Vrac / Mixte"].map(cat => (
                    <Box
                        key={cat}
                        p={4}
                        border="2px solid"
                        borderColor={formData.category === cat ? "brand.500" : "gray.200"}
                        bg={formData.category === cat ? "brand.50" : "white"}
                        borderRadius="xl"
                        cursor="pointer"
                        _hover={{ borderColor: "brand.300" }}
                        onClick={() => setFormData({ ...formData, category: cat })}
                        textAlign="center"
                    >
                        <Text fontWeight="bold">{cat}</Text>
                    </Box>
                ))}
            </SimpleGrid>
        </VStack>
    )

    const StepDetails = () => (
        <VStack spacing={6} align="stretch">
            <Heading size="md">Décrivez votre annonce</Heading>
            <FormControl isRequired>
                <FormLabel>Titre</FormLabel>
                <Input
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Lot de 50 cartons T2 comme neufs"
                />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="État, provenance, usages possibles..."
                    rows={6}
                />
            </FormControl>
        </VStack>
    )

    const StepDimensions = () => (
        <VStack spacing={6} align="stretch">
            <Heading size="md">Caractéristiques</Heading>
            <SimpleGrid columns={3} spacing={4}>
                <FormControl isRequired>
                    <FormLabel fontSize="sm">Longueur (cm)</FormLabel>
                    <Input type="number" value={formData.length} onChange={e => setFormData({ ...formData, length: e.target.value })} />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel fontSize="sm">Largeur (cm)</FormLabel>
                    <Input type="number" value={formData.width} onChange={e => setFormData({ ...formData, width: e.target.value })} />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel fontSize="sm">Hauteur (cm)</FormLabel>
                    <Input type="number" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} />
                </FormControl>
            </SimpleGrid>
            <FormControl isRequired>
                <FormLabel>Quantité disponible</FormLabel>
                <Input type="number" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
            </FormControl>
        </VStack>
    )

    const StepPricePhoto = () => (
        <VStack spacing={6} align="stretch">
            <Heading size="md">Prix & Photos</Heading>
            <FormControl isRequired>
                <FormLabel>Prix du lot (€)</FormLabel>
                <Input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" fontSize="lg" fontWeight="bold" />
            </FormControl>

            <FormControl>
                <FormLabel>Photo</FormLabel>
                <Box
                    border="2px dashed"
                    borderColor="gray.300"
                    borderRadius="xl"
                    p={8}
                    textAlign="center"
                    cursor="pointer"
                    _hover={{ bg: "gray.50" }}
                    position="relative"
                >
                    <Input
                        type="file"
                        opacity={0}
                        position="absolute" top={0} left={0} w="full" h="full" cursor="pointer"
                        accept="image/*"
                        onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            const filePath = `${Math.random()}.${file.name.split('.').pop()}`
                            const { error: upErr } = await supabase.storage.from('listings').upload(filePath, file)
                            if (!upErr) {
                                const { data } = supabase.storage.from('listings').getPublicUrl(filePath)
                                setFormData({ ...formData, image_url: data.publicUrl })
                            }
                        }}
                    />
                    <VStack>
                        {formData.image_url ? (
                            <Box boxSize="100px" bg="gray.100" borderRadius="md" overflow="hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={formData.image_url} alt="Aperçu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </Box>
                        ) : (
                            <Icon as={Camera} w={8} h={8} color="gray.400" />
                        )}
                        <Text>{formData.image_url ? "Modifier la photo" : "Ajouter une photo"}</Text>
                    </VStack>
                </Box>
            </FormControl>
        </VStack>
    )

    const StepLocation = () => (
        <VStack spacing={6} align="stretch">
            <Heading size="md">Où sont les cartons ?</Heading>
            <Button
                variant="outline"
                leftIcon={<Icon as={MapPin} />}
                onClick={() => {
                    navigator.geolocation.getCurrentPosition(pos => {
                        setFormData({
                            ...formData,
                            location_lat: pos.coords.latitude,
                            location_lng: pos.coords.longitude
                        })
                        toast({ title: "Localisé !", status: "success" })
                    })
                }}
            >
                Utiliser ma position actuelle
            </Button>

            <Box p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="sm" color="gray.600">
                    Lat: {formData.location_lat.toFixed(4)}, Lng: {formData.location_lng.toFixed(4)}
                </Text>
            </Box>
        </VStack>
    )

    return (
        <Container maxW="container.md" py={8} pb={24}>
            {/* Header */}
            <Flex justify="space-between" align="center" mb={8}>
                <Link href="/dashboard/company">
                    <Button variant="ghost" size="sm" leftIcon={<Icon as={ArrowLeft} />}>Annuler</Button>
                </Link>
                <Text fontWeight="bold" color="brand.600">Déposer une annonce</Text>
                <Box w={20} />
            </Flex>

            {/* Progress Bar */}
            <Box mb={8}>
                <Progress value={(step + 1) / STEPS.length * 100} size="sm" colorScheme="brand" borderRadius="full" />
                <Flex justify="space-between" mt={2}>
                    {STEPS.map((s, i) => (
                        <Text key={i} fontSize="xs" fontWeight={i === step ? "bold" : "normal"} color={i <= step ? "brand.600" : "gray.400"}>
                            {s.title}
                        </Text>
                    ))}
                </Flex>
            </Box>

            {/* Step Content */}
            <Box bg="white" borderRadius="2xl" shadow="sm" border="1px" borderColor="gray.100" p={8} mb={8}>
                {step === 0 && <StepCategory />}
                {step === 1 && <StepDetails />}
                {step === 2 && <StepDimensions />}
                {step === 3 && <StepPricePhoto />}
                {step === 4 && <StepLocation />}
            </Box>

            {/* Navigation Buttons */}
            <Flex justify="space-between">
                <Button
                    onClick={handlePrev}
                    isDisabled={step === 0}
                    variant="ghost"
                >
                    Retour
                </Button>

                {step === STEPS.length - 1 ? (
                    <Button
                        colorScheme="brand"
                        size="lg"
                        onClick={handleSubmit}
                        isLoading={loading}
                        leftIcon={<Icon as={CheckCircle} />}
                    >
                        Publier
                    </Button>
                ) : (
                    <Button
                        colorScheme="brand"
                        size="lg"
                        onClick={handleNext}
                        rightIcon={<Icon as={ArrowRight} />}
                    >
                        Suivant
                    </Button>
                )}
            </Flex>
        </Container>
    )
}
