"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Box, Text, VStack, HStack, Avatar, Icon, useColorModeValue, Spinner, Center } from "@chakra-ui/react"
import { Trophy } from "lucide-react"

interface LeaderboardUser {
    id: string
    company_name: string
    carbon_score: number
    role: string
}

export function Leaderboard({ limit = 10, compact = false }: { limit?: number, compact?: boolean }) {
    const [users, setUsers] = useState<LeaderboardUser[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('id, company_name, carbon_score, role')
                .order('carbon_score', { ascending: false })
                .limit(limit)

            if (data) setUsers(data)
            setLoading(false)
        }

        fetchLeaderboard()
    }, [limit])

    if (loading) return <Center p={4}><Spinner color="brand.500" /></Center>

    return (
        <Box
            w="full"
            bg={compact ? "transparent" : "white"}
            p={compact ? 0 : 6}
            borderRadius={compact ? "none" : "3xl"}
            borderWidth={compact ? 0 : "1px"}
            borderColor="eco.100"
            shadow={compact ? "none" : "sm"}
        >
            {!compact && (
                <HStack mb={4} spacing={2}>
                    <Icon as={Trophy} color="brand.500" w={6} h={6} />
                    <Text fontWeight="black" fontSize="lg" color="brand.900">Classement des Recycleurs</Text>
                </HStack>
            )}

            <VStack spacing={3} align="stretch">
                {users.map((user, index) => (
                    <HStack
                        key={user.id}
                        justify="space-between"
                        p={2}
                        borderRadius="xl"
                        _hover={{ bg: "eco.50" }}
                        transition="all 0.2s"
                    >
                        <HStack spacing={4}>
                            <Center
                                w={8}
                                h={8}
                                borderRadius="full"
                                fontWeight="black"
                                fontSize="sm"
                                bg={
                                    index === 0 ? "yellow.400" :
                                        index === 1 ? "eco.200" :
                                            index === 2 ? "brown.200" :
                                                "eco.100"
                                }
                                color={
                                    index === 0 ? "white" :
                                        index === 1 ? "eco.600" :
                                            index === 2 ? "brown.600" :
                                                "eco.500"
                                }
                            >
                                {index + 1}
                            </Center>
                            <HStack spacing={3}>
                                <Avatar size="sm" name={user.company_name} src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.company_name}`} />
                                <Box>
                                    <Text fontWeight="bold" fontSize="sm" color="brand.900" lineHeight="none">{user.company_name || "Recycleur"}</Text>
                                    <Text fontSize="10px" color="brown.400" textTransform="capitalize" fontWeight="medium">
                                        {user.role === 'company' ? 'Entreprise' : 'Particulier'}
                                    </Text>
                                </Box>
                            </HStack>
                        </HStack>
                        <Text fontWeight="black" color="brand.600" fontSize="sm">
                            {user.carbon_score} <Text as="span" fontSize="10px" fontWeight="bold" color="brown.300">kg</Text>
                        </Text>
                    </HStack>
                ))}
            </VStack>
        </Box>
    )
}
