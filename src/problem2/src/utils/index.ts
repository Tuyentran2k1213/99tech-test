import { Token } from "@/types";

export function getExchangeRate(fromToken: Token | null, toToken: Token | null): number {
    if (!fromToken || !toToken) return 1;
    return fromToken.price / toToken.price;
}