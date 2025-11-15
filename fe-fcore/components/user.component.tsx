"use client";
import { useState } from "react";
import { login } from "@/services/auth.service";
import { listOficiales } from "@/services/oficial.service";

export default function Demo() {
    const [token, setToken] = useState<string>("");

    const doLogin = async () => {
        const res = await login({ username: "admin", password: "secret" });
        setToken(res.token);
    };

    const loadOficiales = async () => {
        const data = await listOficiales(token);
        console.log(data);
    };

    return (
        <div>
            <button onClick={doLogin}>Login</button>
            <button onClick={loadOficiales} disabled={!token}>
                Cargar oficiales
            </button>
        </div>
    );
}
