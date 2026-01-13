"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { Box, Button, Container, Flex, Heading, Text, VStack, HStack, Icon, Avatar, SimpleGrid, Card, CardBody, Badge, useColorModeValue, Divider, Tab, TabList, TabPanel, TabPanels, Tabs, Input, FormControl, FormLabel, Switch, useToast } from "@chakra-ui/react"
import { User, LogOut, Package, ShieldCheck, MapPin, Settings as SettingsIcon, Heart, Star, CreditCard } from "lucide-react"
import Link from "next/link"
import { ListingCard } from "@/components/listing-card"

export default function ProfilePage() {
    const { user, signOut } = useAuth()
    const toast = useToast()
    const [profile, setProfile] = useState<any>(null)
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState<any>({
        company_name: "",
        headquarters_address: "",
        phone: ""
    })

    const bgColor = useColorModeValue("gray.50", "gray.900")
    const cardBg = useColorModeValue("white", "gray.800")

    useEffect(() => {
        if (user) {
            fetchData()
        }
    }, [user])

    const fetchData = async () => {
        // 1. Profile
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user!.id)
            .single()

        const profileData = data as any

        if (profileData) {
            setProfile(profileData)
            setEditForm({
                company_name: profileData.company_name || "",
                headquarters_address: profileData.headquarters_address || "",
                phone: profileData.phone || ""
            })
        }

        // 2. Orders (Purchases)
        const { data: ordersData } = await supabase
            .from('orders')
            .select('*, listings(*, profiles(company_name))')
            .eq('buyer_id', user!.id)
            .order('created_at', { ascending: false })

        if (ordersData) setOrders(ordersData)

        setLoading(false)
    }

    const handleUpdateProfile = async () => {
        const { error } = await (supabase
            .from('profiles') as any)
            .update(editForm)
            .eq('id', user!.id)

        if (error) {
            toast({ title: "Erreur", description: error.message, status: "error" })
        } else {
            toast({ title: "Profil mis à jour", status: "success" })
            setIsEditing(false)
            fetchData()
        }
    }

    if (loading) return <Container py={10}><Text>Chargement...</Text></Container>

    return (
        <Container maxW="container.md" py={8} pb={24}>
            {/* Header Identity */}
            <Flex align="center" justify="space-between" mb={8}>
                <HStack spacing={4}>
                    <Avatar size="lg" name={profile?.company_name || user?.email} bg="orange.500" />
                    <VStack align="start" spacing={0}>
                        <Heading size="md">{profile?.company_name || "Utilisateur"}</Heading>
                        <Text color="gray.500" fontSize="sm">{user?.email}</Text>
                        {profile?.role === 'company' && <Badge colorScheme="orange">Compte Pro</Badge>}
                    </VStack>
                </HStack>
                <Button variant="ghost" colorScheme="red" leftIcon={<Icon as={LogOut} />} onClick={() => signOut()}>
                    Déconnexion
                </Button>
            </Flex>

            {/* Quick Actions for Companies */}
            {profile?.role === 'company' && (
                <Link href="/dashboard/company">
                    <Card mb={8} bg="orange.50" borderColor="orange.200" borderWidth="1px">
                        <CardBody>
                            <Flex align="center" justify="space-between">
                                <HStack spacing={3}>
                                    <Icon as={Package} color="orange.600" boxSize={6} />
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight="bold" color="orange.800">Espace Vendeur</Text>
                                        <Text fontSize="sm" color="orange.700">Gérez vos annonces et validez les retraits</Text>
                                    </VStack>
                                </HStack>
                                <Button colorScheme="orange" size="sm">Accéder</Button>
                            </Flex>
                        </CardBody>
                    </Card>
                </Link>
            )}

            <Tabs colorScheme="orange" variant="enclosed" isFitted>
                <TabList mb={6}>
                    <Tab fontWeight="bold"><Icon as={Package} mr={2} /> Mes Commandes</Tab>
                    <Tab fontWeight="bold"><Icon as={SettingsIcon} mr={2} /> Mon Profil</Tab>
                </TabList>

                <TabPanels>
                    {/* MES COMMANDES */}
                    <TabPanel px={0}>
                        <VStack spacing={4}>
                            {orders.length === 0 ? (
                                <Box textAlign="center" py={10}>
                                    <Text color="gray.500">Vous n'avez pas encore de commandes.</Text>
                                    <Link href="/">
                                        <Button mt={4} colorScheme="orange" variant="outline">Trouver des cartons</Button>
                                    </Link>
                                </Box>
                            ) : (
                                orders.map(order => (
                                    <Card key={order.id} w="full" variant="outline" borderColor={order.status === 'picked_up' ? "gray.200" : "green.400"} shadow="sm">
                                        <CardBody>
                                            <Flex justify="space-between" align="start" direction={{ base: "column", sm: "row" }} gap={4}>
                                                <VStack align="start" spacing={1} flex={1}>
                                                    <Badge colorScheme={order.status === 'picked_up' ? "gray" : "green"} mb={1}>
                                                        {order.status === 'picked_up' ? "COMMANDE TERMINÉE" : "À RÉCUPÉRER"}
                                                    </Badge>
                                                    <Heading size="sm">{order.listings?.title}</Heading>
                                                    <Text fontSize="sm" color="gray.600">
                                                        Vendu par : <Text as="span" fontWeight="bold">{order.listings?.profiles?.company_name || "Vendeur"}</Text>
                                                    </Text>
                                                    <Text fontSize="lg" fontWeight="bold" color="orange.600">{order.listings?.price} €</Text>
                                                </VStack>

                                                {/* PICKUP CODE CARD */}
                                                {order.status !== 'picked_up' && (
                                                    <VStack
                                                        bg="green.50"
                                                        p={4}
                                                        borderRadius="lg"
                                                        borderWidth="2px"
                                                        borderColor="green.400"
                                                        align="center"
                                                        w={{ base: "full", sm: "auto" }}
                                                    >
                                                        <Text fontSize="xs" fontWeight="bold" color="green.700" textTransform="uppercase">Code de retrait</Text>
                                                        <Text fontSize="3xl" fontFamily="mono" fontWeight="black" color="green.700" letterSpacing="widest">
                                                            {order.pickup_code}
                                                        </Text>
                                                        <Text fontSize="xs" color="green.600" textAlign="center">Communiquez ce code<br />au vendeur</Text>
                                                    </VStack>
                                                )}
                                            </Flex>
                                        </CardBody>
                                    </Card>
                                ))
                            )}
                        </VStack>
                    </TabPanel>

                    {/* MON PROFIL */}
                    <TabPanel px={0}>
                        <Card variant="outline">
                            <CardBody>
                                <VStack spacing={4} align="stretch">
                                    <Flex justify="space-between" align="center">
                                        <Heading size="sm">Informations Personnelles</Heading>
                                        <Button size="sm" onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)} colorScheme={isEditing ? "green" : "gray"}>
                                            {isEditing ? "Sauvegarder" : "Modifier"}
                                        </Button>
                                    </Flex>
                                    <Divider />

                                    <FormControl>
                                        <FormLabel>Nom / Entreprise</FormLabel>
                                        <Input
                                            value={editForm.company_name}
                                            onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })}
                                            isReadOnly={!isEditing}
                                            variant={isEditing ? "outline" : "filled"}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Adresse</FormLabel>
                                        <Input
                                            value={editForm.headquarters_address}
                                            onChange={(e) => setEditForm({ ...editForm, headquarters_address: e.target.value })}
                                            isReadOnly={!isEditing}
                                            variant={isEditing ? "outline" : "filled"}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Téléphone</FormLabel>
                                        <Input
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            isReadOnly={!isEditing}
                                            variant={isEditing ? "outline" : "filled"}
                                        />
                                    </FormControl>
                                </VStack>
                            </CardBody>
                        </Card>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
    )
}

