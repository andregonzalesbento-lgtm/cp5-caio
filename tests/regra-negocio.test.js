import test from 'node:test'
import assert from 'node:assert/strict'

import {
    calcularTotal,
    getFreteGratisInfo,
    podeAdicionarAoCarrinho,
    removerUmaUnidade,
} from '../src/utils/carrinho.js'
import { validarCupom } from '../src/utils/cupons.js'

test('calcularTotal ignora produtos sem preço definido', () => {
    const carrinho = [
        { id: 1, price: 49.9 },
        { id: 2, price: null },
        { id: 3, price: 89 },
    ]

    assert.equal(calcularTotal(carrinho), 138.9)
})

test('validarCupom rejeita clientes com pedidos anteriores', () => {
    const resultado = validarCupom('PRIMEIRACOMPRA', { pedidosAnteriores: 1 })

    assert.deepEqual(resultado, { valido: false })
})

test('validarCupom aceita clientes sem pedidos anteriores', () => {
    const resultado = validarCupom('primeiracompra', { pedidosAnteriores: 0 })

    assert.deepEqual(resultado, { valido: true, desconto: 0.1 })
})

test('validarCupom retorna inválido quando não há cliente selecionado', () => {
    const resultado = validarCupom('PRIMEIRACOMPRA', null)

    assert.deepEqual(resultado, { valido: false })
})

test('removerUmaUnidade remove uma unidade por vez em sequência', () => {
    let carrinho = [
        { id: 1, price: 49.9 },
        { id: 1, price: 49.9 },
        { id: 2, price: 99.9 },
    ]

    carrinho = removerUmaUnidade(carrinho, 1)
    assert.equal(carrinho.filter((item) => item.id === 1).length, 1)

    carrinho = removerUmaUnidade(carrinho, 1)
    assert.equal(carrinho.filter((item) => item.id === 1).length, 0)
})

test('getFreteGratisInfo calcula o valor restante para atingir a meta de R$ 200', () => {
    assert.deepEqual(getFreteGratisInfo(149.9), {
        meta: 200,
        valor: 149.9,
        restante: 50.1,
        liberado: false,
    })

    assert.deepEqual(getFreteGratisInfo(220), {
        meta: 200,
        valor: 220,
        restante: 0,
        liberado: true,
    })
})

test('podeAdicionarAoCarrinho bloqueia produtos inválidos e permite estoque disponível', () => {
    assert.equal(podeAdicionarAoCarrinho(null), false)
    assert.equal(podeAdicionarAoCarrinho({ estoque: 0, price: 49.9 }), false)
    assert.equal(podeAdicionarAoCarrinho({ estoque: 2, price: null }), false)
    assert.equal(podeAdicionarAoCarrinho({ estoque: 3, price: 49.9 }), true)
})
