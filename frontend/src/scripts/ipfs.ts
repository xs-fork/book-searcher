import { Book } from './searcher';

interface TauriConfig {
  index_dir: string;
  ipfs_gateways: string[];
}

export default async function getIpfsGateways() {
  if (import.meta.env.VITE_TAURI === '1') {
    const api = await import('@tauri-apps/api/primitives');
    return await api.invoke('get_config').then((conf) => {
      const config = conf as TauriConfig;
      const userGateways = config.ipfs_gateways;
      
      // 如果用户设置了网关，返回用户设置；否则返回默认网关
      return userGateways && userGateways.length > 0
        ? userGateways.filter((g) => g.length > 0)
        : ['https://ipfs.1kbtool.com'];
    });
  } else {
    // 从本地存储获取用户设置，如果没有则使用默认网关
    const ipfsGateways: string[] = JSON.parse(
      localStorage.getItem('ipfs_gateways') ||
        '["https://cloudflare-ipfs.com","https://dweb.link","https://ipfs.io","https://gateway.pinata.cloud","https://ipfs.1kbtool.com"]'
    );

    return ipfsGateways.filter((g) => g.length > 0);
  }
}

export function parseIpfsGateways(text: string) {
  const gateways = text.split('\n').filter((g) => g.length > 0);
  return gateways.filter((g, i) => gateways.indexOf(g) === i);
}

export function getDownloadLinkFromIPFS(gateway: string, book: Book) {
  return (
    `${gateway}/ipfs/${book.ipfs_cid}?filename=` +
    encodeURIComponent(`${book.title}_${book.author}.${book.extension}`)
  );
}
