import useFetch from "../hooks/useFetch";
import { Token, TokenResponseData } from "@/types";
import { useEffect, useState } from "react";

const ALL_TOKEN_URL = 'https://interview.switcheo.com/prices.json';
const TOKEN_ICONS_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

const getTokenIcon = (symbol: string):string => `${TOKEN_ICONS_URL}/${symbol}.svg`;

type TokenHandle = (token: Token | null) => void

const useGetTokenData = (setFromToken: TokenHandle, setToToken: TokenHandle) => {
    const [tokens, setTokens] = useState<Token[]>([]);
    const { setIsLoading, isLoading } = useFetch();

    useEffect(() => {
        setIsLoading(true)
        fetch(ALL_TOKEN_URL)
          .then(res => {            
            return res.json()
          })
          .then((data: TokenResponseData[]) => {
            const tempTokenList: Record<string, Token> = {};
            data.forEach(item => {
              tempTokenList[item.currency] = {
                id: item.currency,
                name: item.currency,
                symbol: item.currency,
                icon: getTokenIcon(item.currency),
                price: item.price,
              };
            });
            
        const tokenList = Object.values(tempTokenList);
            setTokens(tokenList);
            setFromToken(tokenList[0] || null);
            setToToken(tokenList[1] || null);
          })
          .finally(() => setIsLoading(false))
      }, []);

      return { tokens, isLoading }
}

export default useGetTokenData;