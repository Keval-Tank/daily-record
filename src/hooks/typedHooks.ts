import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "../app/store";

export const useAppDispatch : () => AppDispatch = useDispatch
export const useAppSelector : TypedUseSelectorHook<RootState> = useSelector;