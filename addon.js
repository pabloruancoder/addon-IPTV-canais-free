const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const iptv = require('iptv-playlist-parser');
const fetch = require('node-fetch');

// LISTA DE CANAIS COMPLETA
const M3U_URLS = [
    'https://list.iptvcat.com/my_list/s/6d84fe3a702132fc562a45e8f0b5b324.m3u8',
    'https://list.iptvcat.com/my_list/s/36a2769d9286813bd9016f81b52bd6aa.m3u8',
    'https://list.iptvcat.com/my_list/s/a83abb504cc1f7ce3c1f1102d5cdd55c.m3u8',
    'https://list.iptvcat.com/my_list/s/fc5b7347289d1070cf0ebe886672a2a4.m3u8',
    'https://list.iptvcat.com/my_list/s/e3a72cb8c2fbef2f10c957019c9a8549.m3u8',
    'https://list.iptvcat.com/my_list/s/5da196b6e93539c9733b3b8abe1cdf9a.m3u8',
    'https://list.iptvcat.com/my_list/s/ab69b67f3089b572b64b412fef172c41.m3u8',
    'https://list.iptvcat.com/my_list/s/3f2f204e56e402f390b1bf854dabd259.m3u8',
    'https://list.iptvcat.com/my_list/s/9f152e62afc4b9e43c62290a3c7541d1.m3u8',
    'https://list.iptvcat.com/my_list/s/378f4c0f398f04319c8cdce33e7ec32a.m3u8',
    'https://list.iptvcat.com/my_list/s/ca3c7fc65b20fae0a11b6ee23f44aa0b.m3u8',
    'https://list.iptvcat.com/my_list/s/1230642b1f82f7918046a41ec9f45f9b.m3u8',
    'https://list.iptvcat.com/my_list/s/0cde27bcd735bc2223368e6ee9bb98ed.m3u8',
    'https://list.iptvcat.com/my_list/s/8227718dddaa819430aa1dc5e2e409ed.m3u8',
    'https://list.iptvcat.com/my_list/s/7846004640a91abcac6f7b0880194012.m3u8',
    'https://list.iptvcat.com/my_list/s/7f35e050885b857d5f9093b80ffbe665.m3u8',
    'https://list.iptvcat.com/my_list/s/aa0600f375a8e821455fd5e9c876c1a6.m3u8',
    'https://list.iptvcat.com/my_list/s/81db07109603d7f677346d1db71104da.m3u8',
    'https://list.iptvcat.com/my_list/s/58f1fd0e9e0d2239ed50808b4c7c284f.m3u8',
    'https://list.iptvcat.com/my_list/s/8a45385a4e0bf980f2dfba59d68f216d.m3u8',
    'https://list.iptvcat.com/my_list/s/73b21c4a974d5dfe0f85c02b874809fa.m3u8',
    'https://list.iptvcat.com/my_list/s/d5bdf343bbe87aadbe2406c68293c8f2.m3u8',
    'https://list.iptvcat.com/my_list/s/3c33d0715ffcb41605ff6afd2ccffd82.m3u8',
    'https://list.iptvcat.com/my_list/s/40172ab84b3d3de0a2bd0967b540a982.m3u8',
    'https://list.iptvcat.com/my_list/s/fe8493898c1e43bc9aa40bad5f4683d6.m3u8',
    'https://list.iptvcat.com/my_list/s/91913cd57ebe38eb8ffd3c508049f62d.m3u8',
    'https://list.iptvcat.com/my_list/s/17267ccf7280f20345b29fd72bf9fe8e.m3u8',
    'https://list.iptvcat.com/my_list/s/7d7aa12764d26e6315e8b99bbfd2ad50.m3u8',
    'https://list.iptvcat.com/my_list/s/967fb575d0968d446cf6e26345f6e645.m3u8',
    'https://list.iptvcat.com/my_list/s/f410001aa718b4cb9c4d39c1328779b7.m3u8',
    'https://list.iptvcat.com/my_list/s/849ea2deeec4073b1ffb3c2c06c64350.m3u8',
    'https://list.iptvcat.com/my_list/s/16245ad7312996cf245585e72ebf88af.m3u8',
    'https://list.iptvcat.com/my_list/s/a678464718363591ee5c299492365daa.m3u8',
    'https://list.iptvcat.com/my_list/s/115acd1cae1c227d6dee4d13200d2d15.m3u8',
    'https://list.iptvcat.com/my_list/s/775e5f5d79ae72506aea228924bba36b.m3u8',
    'https://list.iptvcat.com/my_list/s/07b2a9e80da5bfe82cfe53a14e93a543.m3u8',
    'https://list.iptvcat.com/my_list/s/21f760bc5ccb93dcf4ddefeee1b5f571.m3u8',
    'https://list.iptvcat.com/my_list/s/7c8a1f2ff97f9d8a2ad907f6dcd209fd.m3u8',
    'https://list.iptvcat.com/my_list/s/d7e713ad9a0fa4082da31ded4284ca33.m3u8',
    'https://list.iptvcat.com/my_list/s/f016b76a2073e0181cffc0af2c9c0349.m3u8',
    'https://list.iptvcat.com/my_list/s/60bc6f43492219b96374a6f36e10a42b.m3u8',
    'https://list.iptvcat.com/my_list/s/e0947e53834b44c26daf5f0dcc935d0f.m3u8',
    'https://list.iptvcat.com/my_list/s/2179b6f37c2e9f97b5ac315bf4db160f.m3u8',
    'https://list.iptvcat.com/my_list/s/9544c974ea6f9825b849d616d731fbb3.m3u8',
    'https://list.iptvcat.com/my_list/s/5046e7d143d2bcc2c11f9787ae040af5.m3u8',
    'https://list.iptvcat.com/my_list/s/145eea99e976eb0333205a784bd88fab.m3u8',
    'https://list.iptvcat.com/my_list/s/233a695bef86a7068aac76c1a1b5af9a.m3u8',
    'https://list.iptvcat.com/my_list/s/badf0546c1a5b280607367208166cd5f.m3u8',
    'https://list.iptvcat.com/my_list/s/b03cde086677f0858b468b4a87db3ef7.m3u8',
    'https://list.iptvcat.com/my_list/s/fa9c14cce92c2f6801f73e946fe812ea.m3u8',
    'https://list.iptvcat.com/my_list/s/4fcf99e187edf7de89cf7bfa495d9be2.m3u8',
    'https://list.iptvcat.com/my_list/s/6ca7c25454c6fad010dd73a733cebd57.m3u8',
    'https://list.iptvcat.com/my_list/s/14d252799bcee4e1a7dc06383f72aa7b.m3u8',
    'https://list.iptvcat.com/my_list/s/d5450ade048a960cd70b34ae0763a197.m3u8',
    'https://list.iptvcat.com/my_list/s/0e54e5c3ffa3c2c876bd60aa05ba58f6.m3u8',
    'https://list.iptvcat.com/my_list/s/f8f183d61029ffcfe6908495443c537d.m3u8',
    'https://list.iptvcat.com/my_list/s/1e0325b4afa177ad2d305d112f6fe39c.m3u8',
    'https://list.iptvcat.com/my_list/s/846e238014ede4441bde03d2b387b874.m3u8',
    'https://list.iptvcat.com/my_list/s/4b75246bb4ee2337a9cf7d995628deb2.m3u8',
    'https://list.iptvcat.com/my_list/s/b9fbd2f01208df6d1348fce9bebfea8f.m3u8',
    'https://list.iptvcat.com/my_list/s/5828271ef6eb3ed131f54ebb736b2f6d.m3u8',
    'https://list.iptvcat.com/my_list/s/dddfae830559fc97e307bd07ee25e44d.m3u8',
    'https://list.iptvcat.com/my_list/s/d1aeb88d94b2e368821d973db26d8f90.m3u8',
    'https://list.iptvcat.com/my_list/s/32021ac236c9f9ea9c1ef3a825aa6526.m3u8',
    'https://list.iptvcat.com/my_list/s/69e4a32cf04b01e3d47dae1ec9ad6e5e.m3u8',
    'https://list.iptvcat.com/my_list/s/505f7f59a699ffbaf5852a7cb4e97afd.m3u8',
    'https://list.iptvcat.com/my_list/s/1ab79ba4eff5681319313524bdbaa21f.m3u8',
    'https://list.iptvcat.com/my_list/s/6ca0478be6a444147baa19d60d9461a9.m3u8',
    'https://list.iptvcat.com/my_list/s/44498cb95c75fa871084f0312167759b.m3u8',
    'https://list.iptvcat.com/my_list/s/04aab9ce65d08bc73824f12758edfecb.m3u8',
    'https://list.iptvcat.com/my_list/s/91be81cd619940b5bf650392e8ba3c6f.m3u8',
    'https://list.iptvcat.com/my_list/s/b3b88f86b6beab3703290031579b9878.m3u8',
    'https://list.iptvcat.com/my_list/s/9c0b2b38601c1570acddaa3e6e5a38da.m3u8',
    'https://list.iptvcat.com/my_list/s/426a43c161f15cdabdd44235aafb6610.m3u8',
    'https://list.iptvcat.com/my_list/s/11dc6168453af44f16823a322656921e.m3u8',
    'https://list.iptvcat.com/my_list/s/76e0a171f16442018050e7285b68de4f.m3u8',
    'https://list.iptvcat.com/my_list/s/818600e9d298839b11a2833dcc13a0de.m3u8',
    'https://list.iptvcat.com/my_list/s/acfef83714ea05c87bb0a3d848ff7ba8.m3u8',
    'https://list.iptvcat.com/my_list/s/c457e455e890976f0178fc5ea371b064.m3u8',
    'https://list.iptvcat.com/my_list/s/a4db422abb277a18dcce139ef6f9be93.m3u8',
    'https://list.iptvcat.com/my_list/s/ebb506e72574226a3b3d8376c47d785a.m3u8',
    'https://list.iptvcat.com/my_list/s/8cbef5c77392453b611dda87d8f131e5.m3u8',
    'https://list.iptvcat.com/my_list/s/5488049dc85ac576c0b487ec873203ec.m3u8',
    'https://list.iptvcat.com/my_list/s/65876fea29d1208fdd5188cb5ae4880a.m3u8',
    'https://list.iptvcat.com/my_list/s/fe31fdb2e33bdfa9d4439eeefd2ec7c0.m3u8',
    'https://list.iptvcat.com/my_list/s/57426dfaaa36eca609c1dee0bdc8bef3.m3u8',
    'https://list.iptvcat.com/my_list/s/76c4496686492e91767817080799a197.m3u8',
    'https://list.iptvcat.com/my_list/s/a27ac37bd6407b94a544f54203c53bcc.m3u8',
    'https://list.iptvcat.com/my_list/s/0c61f14aecbe9b4365cbf791aec15a3b.m3u8',
    'https://list.iptvcat.com/my_list/s/1e4026701e7ff45e5bb2bba2f352f762.m3u8',
    'https://list.iptvcat.com/my_list/s/3f6a7e49560092db379e246aee48107b.m3u8',
    'https://list.iptvcat.com/my_list/s/6edcf76931f8c2a5160b04cfdfa59c75.m3u8',
    'https://list.iptvcat.com/my_list/s/80c1d85c23ad9a1825c10d39ea4eb7fc.m3u8',
    'https://list.iptvcat.com/my_list/s/2cc9a64c84848b5d4335b9464d5d72d9.m3u8',
    'https://list.iptvcat.com/my_list/s/c0e5a11eda7ee6eddafd7fedb4e9eb6c.m3u8',
    'https://list.iptvcat.com/my_list/s/711b318b0375f56b81e3d1ff935f3e79.m3u8',
    'https://list.iptvcat.com/my_list/s/75ff83b53f794e1e41b36991021d5433.m3u8',
    'https://list.iptvcat.com/my_list/s/0c7c910a4d642ba0eab75ea3a35c3c70.m3u8',
    'https://list.iptvcat.com/my_list/s/317b5fe1f522fd4cae641ec5994c7bf6.m3u8',
    'https://list.iptvcat.com/my_list/s/27ee840bf1c378538dc87f02c190be45.m3u8',
    'https://list.iptvcat.com/my_list/s/62f32a6f4c69c0d3b568a9293ed8cf77.m3u8',
    'https://list.iptvcat.com/my_list/s/676e10fb76767e92490a7ae3c2da6ffd.m3u8',
    'https://list.iptvcat.com/my_list/s/22f48fc51cac8c3e6a8e71dff3bd518a.m3u8',
    'https://list.iptvcat.com/my_list/s/d86ab09e4d6a748adbf853d8047cd0aa.m3u8',
    'https://list.iptvcat.com/my_list/s/e40f9ad8a41e85f70ef4a5648b3ae38d.m3u8',
    'https://list.iptvcat.com/my_list/s/7b95e9bf9d943cc1dab25debda6ea995.m3u8',
    'https://list.iptvcat.com/my_list/s/63421aa9fc2cc062850f425f93542639.m3u8',
    'https://list.iptvcat.com/my_list/s/ab4b24619593eb365252f8470f6709dd.m3u8',
    'https://list.iptvcat.com/my_list/s/f6458a45797e149ea5063ec112752579.m3u8',
    'https://list.iptvcat.com/my_list/s/421d26f087f6f7a14c44e2093a060bfc.m3u8',
    'https://list.iptvcat.com/my_list/s/5b91bab83b95a5f0c82f49084fae1200.m3u8',
    'https://list.iptvcat.com/my_list/s/7973dc357017930438840db3dffb0501.m3u8',
    'https://list.iptvcat.com/my_list/s/9c4b22668c60f3ef253cde62faa680ef.m3u8',
    'https://list.iptvcat.com/my_list/s/714c6597f59471f02f6ed51520fc509a.m3u8',
    'https://list.iptvcat.com/my_list/s/9364194c6ce5fc3d55ded27f6bd97d40.m3u8',
    'https://list.iptvcat.com/my_list/s/b39c86c8210ec32263c14ed61c68ad0c.m3u8',
    'https://list.iptvcat.com/my_list/s/55029ff71ee619dde651991fb41716ca.m3u8',
    'https://list.iptvcat.com/my_list/s/dd57cb9fce8feaca996e1e8ca05cb543.m3u8',
    'https://list.iptvcat.com/my_list/s/7a37eedd889c510c7b40e0cd6aae57b1.m3u8',
    'https://list.iptvcat.com/my_list/s/01c596fdd210bb8c3e499d153630e915.m3u8',
    'https://list.iptvcat.com/my_list/s/1f2504ba5927033fd0b3e522e21422c5.m3u8',
    'https://list.iptvcat.com/my_list/s/9e748c775b41d3586a57e408da509eb2.m3u8',
    'https://list.iptvcat.com/my_list/s/be58c83f7af54384dfac16a91eb5db8a.m3u8',
    'https://list.iptvcat.com/my_list/s/acd34b6c51dbe0932d7882e5c49fa7d8.m3u8',
    'https://list.iptvcat.com/my_list/s/812eb972e2380b5e36da128ace59a7a4.m3u8',
    'https://list.iptvcat.com/my_list/s/660e08731c3999ef993552345e2eb2ee.m3u8',
    'https://list.iptvcat.com/my_list/s/f3bbce284f2f4e79519fd42cc6175dd0.m3u8',
    'https://list.iptvcat.com/my_list/s/a7724b55c1514e66b6df3c8b4db19790.m3u8'
];

// MANIFESTO DO ADDON
const manifest = {
    id: 'org.meuaddon.canais.tv', // ID único
    version: '1.1.0', // Versão nova para forçar atualização
    name: 'Canais de TV (BR)',
    description: 'Agregador de canais de TV de listas M3U8.',
    
    // MUDANÇA CRUCIAL: Definimos o tipo como 'tv'
    types: ['tv'], 

    // O Stremio espera estes três recursos para addons de TV
    resources: ['catalog', 'meta', 'stream'], 
    
    catalogs: [{
        // MUDANÇA: O catálogo agora é do tipo 'tv'
        type: 'tv', 
        id: 'iptv_canais_br_tv',
        name: 'Meus Canais de TV'
    }]
};

const builder = new addonBuilder(manifest);

// FUNÇÃO PARA BUSCAR CANAIS
async function getChannels() {
    const promises = M3U_URLS.map(url =>
        fetch(url)
            .then(res => res.text())
            .then(text => iptv.parse(text).items)
            .catch(err => { console.error(`Falha ao buscar lista: ${url}`, err); return []; })
    );
    const results = await Promise.all(promises);
    return results.flat().filter(item => item.url);
}

// HANDLER DO CATÁLOGO
builder.defineCatalogHandler(async ({ type, id }) => {
    console.log(`Pedido de catálogo: ${type} ${id}`);
    // MUDANÇA: Verificamos se o pedido é para nosso catálogo do tipo 'tv'
    if (type === 'tv' && id === 'iptv_canais_br_tv') {
        const channels = await getChannels();
        const metas = channels.map(item => ({
            id: `iptv-br:${item.url}`,
            // MUDANÇA: Os itens do catálogo também são do tipo 'tv'
            type: 'tv', 
            name: item.name,
            poster: item.tvg.logo || 'https://i.imgur.com/gJt2tW8.png',
            posterShape: 'square'
        }));
        return { metas };
    }
    return Promise.resolve({ metas: [] });
});

// HANDLER DE META
builder.defineMetaHandler(async ({ type, id }) => {
    console.log(`Pedido de meta: ${type} ${id}`);
    // MUDANÇA: Verificamos o tipo 'tv'
    if (type === 'tv' && id.startsWith('iptv-br:')) {
        const streamUrl = id.replace('iptv-br:', '');
        const allChannels = await getChannels();
        const channelInfo = allChannels.find(c => c.url === streamUrl);
        
        if (!channelInfo) return Promise.resolve({ meta: null });

        const meta = {
            id: id,
            type: 'tv', // MUDANÇA: O objeto de detalhes é do tipo 'tv'
            name: channelInfo.name,
            poster: channelInfo.tvg.logo || 'https://i.imgur.com/gJt2tW8.png',
            background: channelInfo.tvg.logo || 'https://i.imgur.com/gJt2tW8.png',
            posterShape: 'square'
        };
        
        return Promise.resolve({ meta });
    }
    return Promise.resolve({ meta: null });
});

// HANDLER DE STREAM
builder.defineStreamHandler(async ({ type, id }) => {
    console.log(`Pedido de stream: ${type} ${id}`);
    // MUDANÇA: Verificamos o tipo 'tv'
    if (type === 'tv' && id.startsWith('iptv-br:')) {
        const streamUrl = id.replace('iptv-br:', '');
        
        const stream = {
            url: streamUrl,
            title: 'Assistir ao vivo',
            behaviorHints: {
                // Dica para ajudar players de TV a entenderem o formato
                notWebReady: true, 
            }
        };
        
        return Promise.resolve({ streams: [stream] });
    }
    return Promise.resolve({ streams: [] });
});


// INICIANDO O SERVIDOR
const PORT = process.env.PORT || 7000;
serveHTTP(builder.getInterface(), { port: PORT });

console.log(`Addon rodando! Abra este link no Stremio:`);
console.log(`http://127.0.0.1:${PORT}/manifest.json`);