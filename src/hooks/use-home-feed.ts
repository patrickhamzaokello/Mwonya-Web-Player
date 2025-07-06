"use client"

import { useState, useEffect } from "react"
import type { HomeFeedResponse } from "@/lib/home_feed_types"
import { fetchHomeFeed } from "@/actions/homefeed"

export function useHomeFeed(userID: string, page = 1) {
  const [data, setData] = useState<HomeFeedResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadHomeFeed = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await fetchHomeFeed(userID, page)

        if (result) {
          setData(result)
        } else {
          setError("Failed to load home feed data")
        }
      } catch (err) {
        setError("An error occurred while loading data")
        console.error("Home feed error:", err)
      } finally {
        setLoading(false)
      }
    }

    if (userID) {
      loadHomeFeed()
    }
  }, [userID, page])

  const refetch = async () => {
    await fetchHomeFeed(userID, page)
      .then(setData)
      .catch((err) => {
        setError("An error occurred while loading data")
        console.error("Home feed error:", err)
      })
      .finally(() => setLoading(false))
  }

  return { data, loading, error, refetch }
}
