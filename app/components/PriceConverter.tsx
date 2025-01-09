'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PriceConverter() {
  const [dollarAmount, setDollarAmount] = useState('')
  const [bolivarAmount, setBolivarAmount] = useState('')
  const exchangeRate = 35.5 // Tasa de cambio ficticia, deberías usar una API para obtener la tasa real

  const handleConvert = () => {
    const amount = parseFloat(dollarAmount)
    if (!isNaN(amount)) {
      setBolivarAmount((amount * exchangeRate).toFixed(2))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversor de Precios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <Input
            type="number"
            placeholder="Monto en USD"
            value={dollarAmount}
            onChange={(e) => setDollarAmount(e.target.value)}
          />
          <Button onClick={handleConvert}>Convertir a Bolívares</Button>
          {bolivarAmount && (
            <div className="text-lg font-semibold">
              {dollarAmount} USD = {bolivarAmount} Bs.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

