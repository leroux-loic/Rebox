"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { ListingCard } from "@/components/listing-card"
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Icon,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  Image,
} from "@chakra-ui/react"
import { Search, ArrowRight, Package, Truck, Leaf, ShieldCheck, Box as BoxIcon } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { formatDate } from "@/lib/utils"

export default function Home() {
  const [recentListings, setRecentListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentListings()
  }, [])

  const fetchRecentListings = async () => {
    const { data } = await supabase
      .from('listings')
      .select('*, profiles(company_name)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(6)

    if (data) setRecentListings(data)
    setLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = '/dashboard/individual'
  }

  return (
    <Box bg="eco.50" minH="100vh">
      {/* HERO SECTION */}
      <Box position="relative" overflow="hidden" pt={{ base: 12, md: 0 }} pb={{ base: 12, md: 0 }}>
        {/* Background Decorative Elements */}
        <Box
          position="absolute" top="-10%" left="10%" boxSize="600px"
          bg="brand.400" filter="blur(140px)" opacity="0.1" borderRadius="full"
          as={motion.div} animate={{ scale: [1, 1.1, 1], x: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity } as any}
        />
        <Box
          position="absolute" bottom="0" right="10%" boxSize="500px"
          bg="brown.400" filter="blur(140px)" opacity="0.1" borderRadius="full"
          as={motion.div} animate={{ scale: [1.1, 1, 1.1], x: [0, -30, 0] }} transition={{ duration: 12, repeat: Infinity } as any}
        />

        <Container maxW="container.xl" position="relative" zIndex="1">
          <Flex direction={{ base: "column", md: "row" }} alignItems="center" minH={{ md: "80vh" }} py={20} gap={16}>
            <VStack align="start" spacing={8} flex="1">
              <Badge
                px={4} py={1.5}
                borderRadius="full"
                fontSize="sm"
                fontWeight="extrabold"
                textTransform="uppercase"
                letterSpacing="widest"
                boxShadow="sm"
                bg="brown.100"
                color="brown.800"
              >
                ♻️ Le futur du carton
              </Badge>
              <Heading
                as="h1"
                fontSize={{ base: "4xl", md: "7xl" }}
                fontWeight="900"
                lineHeight="1"
                letterSpacing="tight"
                color="brand.900"
              >
                Déménagez avec{" "}
                <Text as="span" bgGradient="linear(to-r, brand.500, brand.800)" bgClip="text">
                  Intelligence.
                </Text>
              </Heading>
              <Text fontSize={{ base: "xl", md: "2xl" }} color="brown.700" maxW="600px" lineHeight="tall">
                La première plateforme SaaS de revente de cartons. Donnez une seconde vie à vos déchets, économisez et protégez la planète.
              </Text>

              <form onSubmit={handleSearch} style={{ width: '100%' }}>
                <Flex
                  w="full"
                  bg="white"
                  p={2.5}
                  borderRadius="2xl"
                  shadow="2xl"
                  borderWidth="1px"
                  borderColor="eco.100"
                  gap={2}
                  direction={{ base: "column", sm: "row" }}
                >
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={Search} color="eco.400" mt={1} />
                    </InputLeftElement>
                    <Input
                      placeholder="Taille, quantité, ville..."
                      variant="unstyled"
                      px={4}
                      h="56px"
                      fontSize="lg"
                    />
                  </InputGroup>
                  <Button
                    colorScheme="brand"
                    px={10}
                    h="56px"
                    fontSize="lg"
                    borderRadius="xl"
                    boxShadow="0 4px 14px 0 rgba(0, 135, 83, 0.39)"
                    _hover={{ boxShadow: "0 6px 20px rgba(0, 135, 83, 0.23)" }}
                  >
                    Trouver des cartons
                  </Button>
                </Flex>
              </form>

              <HStack spacing={6} pt={4}>
                <HStack spacing={-3}>
                  {[1, 2, 3, 4].map(i => (
                    <Avatar key={i} size="sm" border="2px solid white" src={`https://i.pravatar.cc/100?u=${i}`} />
                  ))}
                  <Flex boxSize="32px" borderRadius="full" bg="brand.500" color="white" alignItems="center" justify="center" fontSize="xs" fontWeight="bold" border="2px solid white">+2k</Flex>
                </HStack>
                <Text color="brown.600" fontSize="sm" fontWeight="medium">Déjà plus de 2,000 boîtes sauvées ce mois-ci</Text>
              </HStack>
            </VStack>

            {/* Visual Element */}
            <Box flex="1" position="relative" display={{ base: "none", md: "block" }}>
              <Box
                as={motion.div}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8 } as any}
                position="relative"
              >
                <Box
                  bgGradient="linear(to-br, brand.50, brown.50)"
                  borderRadius="4xl"
                  p={8}
                  boxShadow="inner"
                  border="1px solid"
                  borderColor="white"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1595246140625-573b715d11dc?q=80&w=2070&auto=format&fit=crop"
                    alt="Cartons ReBox"
                    borderRadius="2xl"
                    shadow="2xl"
                  />
                </Box>

                {/* Floating UI Elements */}
                <Box
                  position="absolute"
                  top="-40px"
                  right="-20px"
                  bg="white"
                  p={5}
                  borderRadius="2xl"
                  shadow="xl"
                  as={motion.div}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity } as any}
                >
                  <HStack>
                    <Box boxSize="40px" bg="brown.100" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                      <Icon as={Leaf} color="brown.600" />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color="brown.500">Impact CO2</Text>
                      <Text fontWeight="bold" color="brown.900">- 45.2 kg</Text>
                    </VStack>
                  </HStack>
                </Box>
              </Box>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* CATEGORIES SECTION */}
      <Box bg="eco.100" py={24}>
        <Container maxW="container.xl">
          <VStack spacing={1} alignItems="center" mb={16}>
            <Text color="brand.600" fontWeight="bold" fontSize="sm" textTransform="uppercase">Nos Solutions</Text>
            <Heading size="2xl" color="brand.900">Trouvez votre kit idéal</Heading>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {[
              { label: "Déménagement complet", icon: Package, price: "À partir de 15€" },
              { label: "Palettes & Gros Volume", icon: Truck, price: "Stock Pro" },
              { label: "Petits Envois", icon: BoxIcon, price: "Pack de 10" },
            ].map((cat, i) => (
              <Box
                key={i}
                p={8}
                bg="white"
                borderRadius="3xl"
                shadow="sm"
                transition="all 0.4s"
                _hover={{ transform: "translateY(-12px)", shadow: "2xl", borderColor: "brand.100" }}
                borderWidth="2px"
                borderColor="transparent"
                cursor="pointer"
                position="relative"
                overflow="hidden"
              >
                <Box boxSize="60px" bg="brand.50" borderRadius="2xl" mb={6} display="flex" alignItems="center" justifyContent="center" color="brand.500">
                  <Icon as={cat.icon} boxSize={8} />
                </Box>
                <Heading size="md" mb={2} color="brand.800">{cat.label}</Heading>
                <Text color="brown.600" mb={6}>La solution optimale pour vos besoins en cartons de seconde main.</Text>
                <Link href={`/dashboard/individual?category=${cat.label}`}>
                  <Button variant="link" colorScheme="brand" rightIcon={<ArrowRight size={16} />}>
                    Voir les annonces
                  </Button>
                </Link>
                <Text position="absolute" top={6} right={8} fontSize="sm" fontWeight="bold" color="brown.500">{cat.price}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* TRUST SECTION */}
      <Container maxW="container.xl" py={24}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={20} alignItems="center">
          <VStack align="start" spacing={8}>
            <Heading size="2xl" color="brand.900">Pourquoi choisir ReBox pour vos cartons ?</Heading>
            <VStack align="start" spacing={6}>
              {[
                { title: "Économie Circulaire", desc: "Favorisez le réemploi plutôt que le recyclage énergivore.", icon: Leaf, color: "brand" },
                { title: "Prix Imbattables", desc: "Des tarifs jusqu'à 70% moins chers que le neuf.", icon: ShieldCheck, color: "brown" },
                { title: "Local & Rapide", desc: "Trouvez des cartons à moins de 5km de chez vous.", icon: Truck, color: "brand" },
              ].map((item, i) => (
                <HStack key={i} spacing={5} align="start">
                  <Box boxSize="50px" bg={`${item.color}.50`} borderRadius="xl" display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                    <Icon as={item.icon} boxSize={6} color={`${item.color}.500`} />
                  </Box>
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" fontSize="lg" color="brand.800">{item.title}</Text>
                    <Text color="brown.600">{item.desc}</Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
            <Link href="/a-propos">
              <Button size="lg" variant="outline" borderColor="brown.200" px={8} color="brown.700">En savoir plus sur notre mission</Button>
            </Link>
          </VStack>
          <Box position="relative">
            <Box bg="brown.100" w="full" h="500px" borderRadius="3xl" overflow="hidden" shadow="2xl">
              <Image
                src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2068&auto=format&fit=crop"
                alt="Marketplace ReBox"
                objectFit="cover"
                w="full"
                h="full"
              />
            </Box>
            {/* Overlay UI */}
            <Box
              position="absolute"
              bottom="-30px"
              left="-30px"
              bg="white"
              p={6}
              borderRadius="3xl"
              shadow="2xl"
              maxW="280px"
              as={motion.div}
              whileHover={{ scale: 1.05 }}
            >
              <VStack align="start" spacing={4}>
                <HStack>
                  <Avatar size="sm" name="Julia" src="https://i.pravatar.cc/100?u=99" />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" fontSize="sm">Vendu par Julia</Text>
                    <Text fontSize="xs" color="brown.400">il y a 2 min</Text>
                  </VStack>
                </HStack>
                <Text fontSize="sm" fontWeight="bold">50 Cartons Standard T2</Text>
                <Flex justifyContent="space-between" w="full" align="center">
                  <Text fontSize="lg" fontWeight="extrabold" color="brand.600">12,00 €</Text>
                  <Badge colorScheme="brand" borderRadius="md">ECO</Badge>
                </Flex>
              </VStack>
            </Box>
          </Box>
        </SimpleGrid>
      </Container>

      {/* LISTINGS SECTION */}
      <Container maxW="container.xl" pb={24}>
        <Flex justifyContent="space-between" align="end" mb={10}>
          <VStack align="start" spacing={1}>
            <Heading size="xl" color="brand.900">Annonces récentes</Heading>
            <Text color="brown.500" fontSize="lg">Les dernières pépites trouvées pour vous</Text>
          </VStack>
          <Link href="/dashboard/individual">
            <Button variant="ghost" rightIcon={<ArrowRight size={18} />} color="brand.600">Toutes les annonces</Button>
          </Link>
        </Flex>

        {loading ? (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={8}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Box key={i} h="380px" bg="eco.100" borderRadius="2xl" as={motion.div} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity } as any} />
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={10}>
            {recentListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  )
}
