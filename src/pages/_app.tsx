import { AudioProvider } from '@/components/player/AudioContext'
import { PlayerProvider } from '@/components/player/Player'
import { PlayerLayout } from '@/layouts/PlayerLayout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import localFont from "next/font/local"
import { useState } from 'react'

const centuryGothic = localFont({
    src: [
        {
            path: './fonts/GOTHIC.woff',
            weight: '400',
            style: 'normal',
        },
        {
            path: './fonts/GOTHICI.woff',
            weight: '400',
            style: 'italic',
        },
        {
            path: './fonts/GOTHICB.woff',
            weight: '700',
            style: 'normal',
        },
        {
            path: './fonts/GOTHICBI.woff',
            weight: '700',
            style: 'italic',
        },
    ],
})

export default function App({ Component, pageProps }: AppProps) {
    return (
        <main className={centuryGothic.className}>
            <PlayerLayout>
                <Component {...pageProps} />
            </PlayerLayout>
        </main>
    )
}
