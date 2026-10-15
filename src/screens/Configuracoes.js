import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet } from 'react-native';
import Cartao from '../components/Cartao';
import { useApp } from '../context/AppContext';
import { cores, fonte, alvoMinimo } from '../theme';

function Linha({ rotulo, ultima, value, onValueChange }) {
  return (
    <View style={[s.linha, !ultima && s.divisor]}>
      <Text style={s.rotulo}>{rotulo}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityLabel={rotulo}
        trackColor={{ false: '#A8A8A8', true: cores.preto }}
        thumbColor={cores.amarelo}
        style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
      />
    </View>
  );
}

export default function Configuracoes() {
  const { config, mudarConfig } = useApp();
  const [wifi, setWifi] = useState(false);
  const [silencio, setSilencio] = useState(true);

  return (
    <ScrollView contentContainerStyle={s.pad}>
      <Text style={s.secao} accessibilityRole="header">Configurações</Text>
      <Cartao style={s.grupo}>
        <Linha rotulo="LEITURA POR VOZ" value={config.leituraPorVoz} onValueChange={(v) => mudarConfig('leituraPorVoz', v)} />
        <Linha rotulo="RESPOSTA POR ÁUDIO" value={config.respostaPorAudio} onValueChange={(v) => mudarConfig('respostaPorAudio', v)} />
        <Linha rotulo="VIBRAÇÃO DO RASTREADOR" value={config.vibracao} onValueChange={(v) => mudarConfig('vibracao', v)} />
        <Linha rotulo="SOM DO RASTREADOR" value={config.som} onValueChange={(v) => mudarConfig('som', v)} ultima />
      </Cartao>

      <Text style={[s.secao, { marginTop: 24 }]} accessibilityRole="header">Modo não incomodar</Text>
      <Cartao style={s.grupo}>
        <Linha rotulo="MODO NÃO INCOMODAR WI-FI" value={wifi} onValueChange={setWifi} />
        <Linha rotulo="PERÍODO DE SILÊNCIO (23:00–07:00)" value={silencio} onValueChange={setSilencio} ultima />
      </Cartao>

      <Text style={[s.secao, { marginTop: 24 }]} accessibilityRole="header">Sobre o software</Text>
      <Cartao style={s.grupo}>
        <View style={s.linha}>
          <Text style={s.rotulo}>VERSÃO</Text>
          <Text style={s.rotulo}>v2.0.7</Text>
        </View>
      </Cartao>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pad: { padding: 16 },
  secao: { fontSize: fonte.rotulo, fontWeight: '900', color: cores.preto, marginBottom: 8, marginLeft: 4 },
  grupo: { padding: 0, overflow: 'hidden' },
  linha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: alvoMinimo + 8, paddingVertical: 10, paddingHorizontal: 16 },
  divisor: { borderBottomWidth: 2, borderBottomColor: cores.preto },
  rotulo: { flex: 1, fontSize: fonte.corpo, fontWeight: '800', color: cores.preto },
});
