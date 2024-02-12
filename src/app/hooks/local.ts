'use client'
import { useState } from "react"
import { AppState } from "../models/appState"

const useLocalStorage = (key: string, initialValue: AppState) => {
  const [state, setState] = useState(() => {
    // Initialize the state
    try {
        if (typeof window !== "undefined") {  
      const value = window.localStorage.getItem(key)
      // Check if the local storage already has any values,
      // otherwise initialize it with the passed initialValue
      return value ? JSON.parse(value) : initialValue
        }   
    } catch (error) {
      console.log(error)
    }
  })

const setValue = (value: AppState) => {
    try {
        // If the passed value is a callback function,
        //  then call it with the existing state.
        const valueToStore = value instanceof Function ? value(state) : value
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
        setState(value)
    } catch (error) {
        console.log(error)
    }
}

  return [state, setValue]
}

export default useLocalStorage