import { useState } from "react";

const useFetch = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string>('');

    return { isLoading, isSuccess, error, setIsLoading, setIsSuccess, setError }
}

export default useFetch