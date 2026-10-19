import { useSyncExternalStore } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

// Serviço padrão de bateria (Battery Service / Battery Level)
const BATERIA_SERVICO = '0000180f-0000-1000-8000-00805f9b34fb';
const BATERIA_CARACTERISTICA = '00002a19-0000-1000-8000-00805f9b34fb';

let manager = null;
let dispositivo = null;
let assinatura = null;
let aparelho = null; // { id, nome, conectado, rssi, bateria } | null
const ouvintes = new Set();

function getManager() {
  if (!manager) manager = new BleManager();
  return manager;
}

// Estado do aparelho mantido fora do componente, para não se perder ao trocar de aba
function definir(novo) {
  aparelho = novo;
  ouvintes.forEach((f) => f());
}

function assinar(f) {
  ouvintes.add(f);
  return () => ouvintes.delete(f);
}

export function useAparelho() {
  return useSyncExternalStore(assinar, () => aparelho);
}

async function pedirPermissoes() {
  if (Platform.OS !== 'android') return true;
  const P = PermissionsAndroid.PERMISSIONS;
  const lista = [P.ACCESS_FINE_LOCATION];
  if (Platform.Version >= 31) lista.push(P.BLUETOOTH_SCAN, P.BLUETOOTH_CONNECT);
  const r = await PermissionsAndroid.requestMultiple(lista);
  return lista.every((p) => r[p] === PermissionsAndroid.RESULTS.GRANTED);
}

function aguardarEstado() {
  return new Promise((resolve) => {
    let sub = null;
    sub = getManager().onStateChange((estado) => {
      if (estado === 'Unknown' || estado === 'Resetting') return;
      if (sub) sub.remove();
      resolve(estado);
    }, true);
  });
}

export async function prepararBluetooth() {
  if (!(await pedirPermissoes())) {
    throw new Error('Permissão de Bluetooth negada. Ative nas configurações do aparelho.');
  }
  const estado = await aguardarEstado();
  if (estado !== 'PoweredOn') {
    throw new Error('Ligue o Bluetooth do aparelho para continuar.');
  }
}

export function iniciarBusca(aoEncontrar, aoErro) {
  const m = getManager();
  m.stopDeviceScan();
  m.startDeviceScan(null, { allowDuplicates: false }, (erro, d) => {
    if (erro) {
      aoErro(erro);
      return;
    }
    if (d) aoEncontrar(d);
  });
}

export function pararBusca() {
  if (manager) manager.stopDeviceScan();
}

export function estimarDistancia(rssi) {
  if (rssi == null) return '—';
  const metros = Math.pow(10, (-59 - rssi) / 20);
  return metros < 1 ? '<1 m' : `~${Math.round(metros)} m`;
}

export async function conectarAparelho(id, nome) {
  const m = getManager();
  const d = await m.connectToDevice(id, { timeout: 15000 });
  await d.discoverAllServicesAndCharacteristics();
  dispositivo = d;
  if (assinatura) assinatura.remove();
  assinatura = m.onDeviceDisconnected(id, () => {
    if (aparelho && aparelho.id === id) definir({ ...aparelho, conectado: false });
  });
  definir({ id, nome, conectado: true, rssi: null, bateria: null });
  await atualizarAparelho();
}

export async function atualizarAparelho() {
  const atual = dispositivo;
  if (!atual || !aparelho || !aparelho.conectado) return;
  let rssi = aparelho.rssi;
  let bateria = aparelho.bateria;
  try {
    const d = await atual.readRSSI();
    rssi = d.rssi;
  } catch (e) {}
  try {
    const c = await atual.readCharacteristicForService(BATERIA_SERVICO, BATERIA_CARACTERISTICA);
    bateria = atob(c.value).charCodeAt(0);
  } catch (e) {}
  if (atual === dispositivo && aparelho && aparelho.conectado) {
    definir({ ...aparelho, rssi, bateria });
  }
}

export async function desconectarAparelho() {
  if (!aparelho) return;
  try {
    await getManager().cancelDeviceConnection(aparelho.id);
  } catch (e) {}
  if (aparelho) definir({ ...aparelho, conectado: false });
}

export async function removerAparelho() {
  const id = aparelho ? aparelho.id : null;
  if (assinatura) {
    assinatura.remove();
    assinatura = null;
  }
  dispositivo = null;
  definir(null);
  if (id) {
    try {
      await getManager().cancelDeviceConnection(id);
    } catch (e) {}
  }
}