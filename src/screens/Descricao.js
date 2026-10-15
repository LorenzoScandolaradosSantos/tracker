import React from 'react';
import { Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cores, fonte, raio } from '../theme';

// cada passo leva direto para a tela correspondente
const PASSOS = [
  { icone: 'bluetooth', texto: 'CONECTE O RASTREADOR', destino: 'radar' },
  { icone: 'waveform', texto: 'TOQUE PARA LOCALIZAR', destino: 'inicio' },
  { icone: 'alert-circle-outline', texto: 'AJUSTE VOZ E ALERTAS', destino: 'config' },
  { icone: 'account-question-outline', texto: 'PERGUNTE AO TRACKER', destino: 'assistente' },
];

export default function Descricao({ irPara }) {
  return (
    <ScrollView contentContainerStyle={s.pad}>
      {PASSOS.map((p, i) => (
        <TouchableOpacity
          key={p.texto}
          style={s.passo}
          onPress={() => irPara(p.destino)}
          accessibilityRole="button"
          accessibilityLabel={`Passo ${i + 1}: ${p.texto.toLowerCase()}`}
          accessibilityHint="Toque para abrir esta tela"
        >
          <MaterialCommunityIcons name={p.icone} size={44} color={cores.preto} />
          <Text style={s.texto}>{p.texto}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pad: { padding: 16, gap: 14 },
  passo: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: cores.branco, borderRadius: raio.cartao, padding: 18, minHeight: 90 },
  texto: { flex: 1, fontSize: fonte.rotulo, fontWeight: '900', color: cores.preto, textAlign: 'center' },
});
