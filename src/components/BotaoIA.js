import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cores } from '../theme';

// Botão vermelho flutuante: abre o assistente (voz + chat)
export default function BotaoIA({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Abrir assistente por voz"
      accessibilityHint="Fale com o assistente para encontrar suas tags"
      style={s.botao}
    >
      <MaterialCommunityIcons name="robot-happy-outline" size={64} color="#fff" />
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  botao: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 110,
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: cores.vermelho,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
  },
});
