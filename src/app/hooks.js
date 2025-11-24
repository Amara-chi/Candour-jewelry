import { useDispatch, useSelector } from 'react-redux'
import { useMemo } from 'react'
import { store } from './store'

export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector
export const useStore = () => store

export const useTypedDispatch = () => {
  const dispatch = useDispatch()
  return useMemo(() => dispatch, [dispatch])
}