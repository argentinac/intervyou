import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // If Supabase isn't configured (missing env vars), skip auth entirely
  const [user, setUser] = useState(supabase ? undefined : { id: 'guest', email: 'guest' })

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signUp = (email, password) =>
    supabase ? supabase.auth.signUp({ email, password }) : Promise.resolve({})

  const signIn = (email, password) =>
    supabase ? supabase.auth.signInWithPassword({ email, password }) : Promise.resolve({})

  const signOut = () =>
    supabase ? supabase.auth.signOut() : Promise.resolve()

  const getToken = async () => {
    if (!supabase) return null
    const { data } = await supabase.auth.getSession()
    return data.session?.access_token ?? null
  }

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut, getToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
