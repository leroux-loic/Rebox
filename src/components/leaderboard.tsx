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

    const bg = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.200', 'gray.700')

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
            bg={compact ? "transparent" : bg}
            p={compact ? 0 : 6}
            borderRadius={compact ? "none" : "xl"}
            borderWidth={compact ? 0 : "1px"}
            borderColor={borderColor}
            shadow={compact ? "none" : "sm"}
        >
            {!compact && (
                <HStack mb={4} spacing={2}>
                    <Icon as={Trophy} color="yellow.500" w={6} h={6} />
                    <Text fontWeight="bold" fontSize="lg">Classement des Recycleurs</Text>
                </HStack>
            )}

            <VStack spacing={3} align="stretch">
                {users.map((user, index) => (
                    <HStack
                        key={user.id}
                        justify="space-between"
                        p={2}
                        borderRadius="lg"
                        _hover={{ bg: "gray.50" }}
                        transition="background 0.2s"
                    >
                        <HStack spacing={4}>
                            <Center
                                w={8}
                                h={8}
                                borderRadius="full"
                                fontWeight="bold"
                                bg={
                                    index === 0 ? "yellow.100" :
                                        index === 1 ? "gray.100" :
                                            index === 2 ? "orange.100" :
                                                "gray.50"
                                }
                                color={
                                    index === 0 ? "yellow.600" :
                                        index === 1 ? "gray.600" :
                                            index === 2 ? "orange.600" :
                                                "gray.500"
                                }
                            >
                                {index + 1}
                            </Center>
                            <HStack spacing={3}>
                                <Avatar size="sm" name={user.company_name} src="" />
                                <Box>
                                    <Text fontWeight="medium" lineHeight="none">{user.company_name || "Utilisateur"}</Text>
                                    <Text fontSize="xs" color="gray.500" textTransform="capitalize">
                                        {user.role === 'company' ? 'Entreprise' : 'Particulier'}
                                    </Text>
                                </Box>
                            </HStack>
                        </HStack>
                        <Text fontWeight="bold" color="brand.600">
                            {user.carbon_score} <Text as="span" fontSize="xs" fontWeight="normal" color="gray.500">kg</Text>
                        </Text>
                    </HStack>
                ))}
            </VStack>
        </Box>
    )
}
