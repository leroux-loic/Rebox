"use client"

import { useAuth } from "@/components/auth-provider"
import { ListingCard } from "@/components/listing-card"
import { supabase } from "@/lib/supabase/client"
import { Box, Button, Container, Flex, Heading, Input, InputGroup, InputLeftElement, SimpleGrid, Text, VStack, Icon, Badge, Select, HStack, useColorModeValue, Image } from "@chakra-ui/react"
import { Search, MapPin, Package, ArrowRight, Truck, Store, Recycle, Star, Box as BoxIcon, Archive } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Category Data with Icons
const CATEGORIES = [
  { id: 'standard', label: 'Petits Cartons', icon: BoxIcon, color: 'brand' },
  { id: 'grand', label: 'Grand Format', icon: Package, color: 'brand' },
  { id: 'demenagement', label: 'Déménagement', icon: Truck, color: 'brand' },
  { id: 'special', label: 'Spéciaux', icon: Archive, color: 'brand' },
  { id: 'vrac', label: 'Lots / Palettes', icon: Store, color: 'brand' },
  { id: 'gratuit', label: 'Gratuits', icon: Recycle, color: 'brand' },
]

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()
  const [recentListings, setRecentListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchRecentListings()
  }, [])

  const fetchRecentListings = async () => {
    const { data } = await supabase
      .from('listings')
      .select('*, profiles(company_name, is_verified)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(6)

    if (data) setRecentListings(data)
    setLoading(false)
  }

  const handleSearch = () => {
    router.push(`/dashboard/individual?search=${searchTerm}`)
  }

  return (
    <Box pb={20} minH="100vh" bg="gray.50">
      {/* PREMIUM HERO SECTION - Forest Green */}
      <Box
        bg="brand.500"
        color="white"
        pt={{ base: 12, md: 24 }}
        pb={{ base: 24, md: 32 }}
        borderBottomRadius={{ base: "2rem", md: "3rem" }}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl" position="relative" zIndex="10">
          <VStack spacing={6} textAlign="center" maxW="3xl" mx="auto">
            <Badge colorScheme="green" bg="whiteAlpha.300" color="white" px={3} py={1} borderRadius="full">
              N°1 du Réemploi Carton
            </Badge>
            <Heading as="h1" size={{ base: "2xl", md: "3xl" }} fontWeight="800" letterSpacing="tight" lineHeight="1.1">
              Donnez une seconde vie <br />
              <Text as="span" color="brand.200">à vos emballages.</Text>
            </Heading>
            <Text fontSize="lg" opacity="0.9" maxW="2xl">
              Achetez des cartons de qualité professionnelle auprès d'entreprises locales ou trouvez des lots gratuits près de chez vous.
            </Text>

            {/* Main Search Bar - Floating */}
            <Box w="full" bg="white" p={2} borderRadius="full" boxShadow="2xl" mt={6}>
              <Flex gap={2}>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <Search className="text-gray-400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Que recherchez-vous ? (ex: Cartons déménagement)"
                    variant="unstyled"
                    color="black"
                    px={2}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </InputGroup>
                <Button
                  display={{ base: "none", sm: "flex" }}
                  size="lg"
                  colorScheme="brand"
                  borderRadius="full"
                  px={10}
                  onClick={handleSearch}
                >
                  Rechercher
                </Button>
              </Flex>
            </Box>
            {/* Mobile Search Button */}
            <Button
              display={{ base: "flex", sm: "none" }}
              size="lg"
              colorScheme="brand"
              w="full"
              borderRadius="full"
              onClick={handleSearch}
              boxShadow="lg"
            >
              Rechercher
            </Button>
          </VStack>
        </Container>

        {/* Decor shapes */}
        <Box position="absolute" top="-10%" left="-5%" boxSize="300px" bg="whiteAlpha.100" borderRadius="full" filter="blur(40px)" />
        <Box position="absolute" bottom="-10%" right="-5%" boxSize="400px" bg="brand.600" borderRadius="full" filter="blur(60px)" opacity="0.5" />
      </Box>

      {/* CATEGORIES GRID - Overlapping Hero */}
      <Container maxW="container.xl" mt={{ base: -12, md: -16 }}>
        <SimpleGrid columns={{ base: 3, md: 6 }} spacing={4} mb={16}>
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} href={`/dashboard/individual?category=${cat.label}`}>
              <Flex
                direction="column"
                align="center"
                justify="center"
                bg="white"
                p={4}
                h="full"
                borderRadius="2xl"
                boxShadow="lg"
                transition="all 0.2s"
                _hover={{ transform: "translateY(-4px)", boxShadow: "xl", color: "brand.600" }}
                role="group"
              >
                <Box bg="gray.50" p={3} borderRadius="full" mb={3} _groupHover={{ bg: "brand.50" }}>
                  <Icon as={cat.icon} boxSize={6} color="gray.600" _groupHover={{ color: "brand.600" }} />
                </Box>
                <Text fontWeight="bold" fontSize={{ base: "xs", md: "sm" }} textAlign="center" color="gray.700">{cat.label}</Text>
              </Flex>
            </Link>
          ))}
        </SimpleGrid>

        {/* LISTINGS SECTION */}
        <Box mb={16}>
          <Flex justify="space-between" align="center" mb={8}>
            <VStack align="start" spacing={1}>
              <Heading size="lg" color="gray.800">Dernières annonces</Heading>
              <Text color="gray.500">Les meilleures offres près de chez vous</Text>
            </VStack>
            <Link href="/dashboard/individual">
              <Button variant="ghost" colorScheme="brand" rightIcon={<ArrowRight size={16} />}>Tout voir</Button>
            </Link>
          </Flex>

          {loading ? (
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={8}>
              {[1, 2, 3].map(i => <Box key={i} h="350px" bg="gray.200" borderRadius="2xl" />)}
            </SimpleGrid>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={8}>
              {recentListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Container>
    </Box>
  )
}
