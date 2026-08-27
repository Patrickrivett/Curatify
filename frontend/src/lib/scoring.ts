export function getCompatibility(userGenres: string[], playlistGenres: string[]): number {
    if (playlistGenres.length === 0) {
      return 0
    }
  
    const userGenreSet = new Set(userGenres)
    const overlap = playlistGenres.filter((genre) => userGenreSet.has(genre)).length
  
    return (overlap / playlistGenres.length) * 100
  }


  export function getDiscoveryRate(
    playlistArtistIds: string[],
    listenedArtistIds: string[]
  ): number {
    if (playlistArtistIds.length === 0) {
      return 0
    }
  
    const listenedSet = new Set(listenedArtistIds)
    const unheard = playlistArtistIds.filter((id) => !listenedSet.has(id)).length
  
    return (unheard / playlistArtistIds.length) * 100
  }

  