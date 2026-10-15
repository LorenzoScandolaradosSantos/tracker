import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Cartao from '../components/Cartao';
import Botao from '../components/Botao';
import { useApp } from '../context/AppContext';
import { cores, fonte, raio } from '../theme';

export default function Inicio({ irPara }) {
  const { tags, tocar } = useApp();
  return (
    <ScrollView contentContainerStyle={s.pad}>
      {tags.length === 0 && (
        <Cartao>
          <Text style={s.titulo}>NENHUMA TAG</Text>
          <Text style={s.suave}>Toque em "Adicionar tag" para procurar seu rastreador.</Text>
        </Cartao>
      )}

      {tags.map((t) => (
        <Cartao key={t.id}>
          <Text style={s.titulo} accessibilityRole="header">{t.nome.toUpperCase()}</Text>
          <View style={s.linha}>
            <View style={s.icone} accessible={false}>
              <Ionicons name={t.icone || 'bluetooth'} size={44} color={cores.branco} />
            </View>
            <Botao
              titulo="TOCAR"
              variante="escuro"
              style={{ flex: 1, minHeight: 84 }}
              rotulo={`Tocar ${t.nome}`}
              onPress={() => tocar(t.id)}
            />
          </View>
        </Cartao>
      ))}

      <Cartao>
        <Text style={s.titulo} accessibilityRole="header">ADICIONAR TAG</Text>
        <Botao titulo="+" variante="escuro" style={{ minHeight: 84 }} rotulo="Adicionar nova tag" onPress={() => irPara('radar')} />
      </Cartao>
      <View style={{ height: 150 }} />{/* espaço para o botão vermelho */}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pad: { padding: 16, gap: 16 },
  titulo: { fontSize: fonte.titulo, fontWeight: '900', color: cores.preto, textAlign: 'center', marginBottom: 10 },
  suave: { fontSize: fonte.corpo, color: cores.textoSuave, textAlign: 'center' },
  linha: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  icone: { width: 84, height: 84, borderRadius: raio.botao, backgroundColor: '#9A9A9A', alignItems: 'center', justifyContent: 'center' },
});
