import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cores } from '../theme';

const ABAS = [
  { id: 'inicio', rotulo: 'Início', icone: 'home' },
  { id: 'radar', rotulo: 'Adicionar tag', icone: 'radar' },
];

export default function BarraNavegacao({ atual, onSelecionar }) {
  return (
    <View style={s.barra}>
      {ABAS.map((a) => {
        const ativa = atual === a.id;
        return (
          <TouchableOpacity
            key={a.id}
            style={[s.aba, ativa && s.abaAtiva]}
            onPress={() => onSelecionar(a.id)}
            accessibilityRole="tab"
            accessibilityLabel={a.rotulo}
            accessibilityState={{ selected: ativa }}
          >
            <MaterialCommunityIcons name={a.icone} size={36} color={cores.preto} />
            <Text style={[s.rotulo, ativa && { fontWeight: '900' }]}>{a.rotulo}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  barra: { flexDirection: 'row', backgroundColor: cores.branco, paddingBottom: 16 },
  aba: { flex: 1, alignItems: 'center', paddingVertical: 10, minHeight: 72, borderRightWidth: 2, borderRightColor: cores.cinza },
  abaAtiva: { backgroundColor: cores.amarelo },
  rotulo: { fontSize: 13, color: cores.preto, marginTop: 2 },
});
