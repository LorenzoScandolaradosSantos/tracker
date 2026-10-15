import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { cores, raio, fonte, alvoMinimo } from '../theme';

const VARIANTES = {
  primario: { fundo: cores.destaque, texto: '#fff', borda: cores.destaque },
  neutro: { fundo: cores.superficie, texto: cores.texto, borda: cores.preto },
  perigo: { fundo: cores.perigoSuave, texto: cores.perigo, borda: cores.perigo },
  escuro: { fundo: cores.preto, texto: cores.branco, borda: cores.preto },
};

export default function Botao({ titulo, variante = 'neutro', onPress, style, rotulo, desabilitado }) {
  const v = VARIANTES[variante];
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={desabilitado}
      accessibilityRole="button"
      accessibilityLabel={rotulo || titulo}
      accessibilityState={{ disabled: !!desabilitado }}
      style={[s.botao, { backgroundColor: v.fundo, borderColor: v.borda }, style]}
    >
      <Text style={[s.texto, { color: v.texto }]}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  botao: {
    borderWidth: 2,
    borderRadius: raio.botao,
    minHeight: alvoMinimo,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: { fontWeight: '800', fontSize: fonte.rotulo, textAlign: 'center' },
});
