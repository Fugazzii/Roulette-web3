import { atom } from "recoil";
import type { RecoilState } from "recoil";

export const BALANCE: RecoilState<number> = atom({
    key: 'balance',
    default: 0
});

export const ANIMATION: RecoilState<boolean> = atom({
    key: 'animation',
    default: false
});

export const IS_AUTHED: RecoilState<boolean> = atom({
    key: 'auth',
    default: false
})