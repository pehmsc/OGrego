"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";

type CartItem = {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    quantidade: number;
    imagem: string;
};

type CartContextType = {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantidade">) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantidade: number) => void;
    clearCart: () => void;
    totalItems: number;
    subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Carregar do localStorage ao iniciar
    useEffect(() => {
        const saved = localStorage.getItem("cart");
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (error) {
                console.error("Erro ao carregar carrinho:", error);
            }
        }
    }, []);

    // Guardar no localStorage sempre que mudar
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const addItem = (newItem: Omit<CartItem, "quantidade">) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === newItem.id);
            if (existing) {
                // Item já existe → aumentar quantidade
                return prev.map((item) =>
                    item.id === newItem.id
                        ? { ...item, quantidade: item.quantidade + 1 }
                        : item,
                );
            } else {
                // Item novo → adicionar com quantidade 1
                return [...prev, { ...newItem, quantidade: 1 }];
            }
        });
    };

    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: number, quantidade: number) => {
        if (quantidade <= 0) {
            removeItem(id);
        } else {
            setItems((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, quantidade } : item,
                ),
            );
        }
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem("cart");
    };

    const totalItems = items.reduce((acc, item) => acc + item.quantidade, 0);
    const subtotal = items.reduce(
        (acc, item) => acc + item.preco * item.quantidade,
        0,
    );

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                totalItems,
                subtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart deve ser usado dentro de CartProvider");
    }
    return context;
}
