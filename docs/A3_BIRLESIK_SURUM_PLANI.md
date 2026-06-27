# A3 Birlesik Surum Plani

Amaç: A1 ve A2 calismalarini ana projede tek bir final urun akisi haline getirmek.

Ana proje: `csezeze/blitzpass-monad`

Kaynaklar:

- A1: `emir07emir/blitz-market-a1`
- A2: `csezeze/blitz-market-a2`

## Kisa Karar

A3 ayri ve kopuk bir repo gibi dusunulmemeli. A3, ana projeye entegre edilmis final surum olmali.

Dogru birlesim:

- A1: etkinlik odasi, pass claim ve odul kazanma akisi.
- A2: market, cuzdan, swap, satin alma ve receipt deneyimi.
- Ana proje: Monad uyumlu kontratlar, deploy scriptleri ve sync receipt relayer.

Bu yuzden A3 icin en dogru temel repo `csezeze/blitzpass-monad`.

## A3 Market Fikri

Uygulamanin market fikri su olmali:

Kullanici bir live event'e katilir, pass claim eder, event'e ozel BlitzCoin kazanir ve bu coinleri markette aninda harcar veya swap eder.

Akis:

```txt
Etkinlige katil -> Pass claim et -> Event coin kazan -> Markete gec -> Gerekirse swap yap -> Urun al -> Receipt ve siparis gor
```

Bu fikir hackathon icin guclu cunku:

- coin sadece puan gibi durmuyor, urune donusuyor,
- A1 ve A2 tek urun hikayesine baglaniyor,
- Monad'in hiz ve paralel islem avantaji gercek bir kullanim aninda anlatiliyor,
- relayer sayesinde kullanici gas tutmadan islem yapabiliyor.

## A3'te A1'den Alinacaklar

A1 tarafindan alinacak ana deger:

- etkinlik odasi mantigi,
- pass claim akisi,
- kullanicinin claim sonrasi coin kazanmasi,
- markete ayni adresle gecis.

A1'den dogrudan alinmamasi gerekenler:

- `BlitzPass` icindeki global `totalTx++` modeli,
- `reward` islemini BlitzPass adresine yollayan relayer yapisi,
- hardcoded `localhost:3001` market linki,
- sadece demo gibi duran odul mesaji.

A1, urun akisini baslatan taraf olmali; kontrat ve relayer mimarisi ana projeden gelmeli.

## A3'te A2'den Alinacaklar

A2 tarafindan alinacak ana deger:

- market ana sayfasi,
- urun katalogu,
- cuzdan/balance gosterimi,
- swap paneli,
- satin alma paneli,
- receipt karti,
- `?addr=0xUSER` adres gecisi,
- TR/EN dil ozelligi,
- siparislerin `Purchased` eventlerinden okunmasi.

A2'de korunmasi gereken teknik yaklasim:

- balance okumada `BlitzCoin.balancesOf`,
- satin almada `BlitzCoin.buy`,
- swap isleminde `BlitzCoin.swap`,
- receipt ekraninda hash, status, block, gas ve explorer linki.

A2'nin tek basina kalmamasi gerekiyor. Final sunumda market, BlitzPass'ten gelen ayni kullanici adresiyle calismali.

## A3'te Ana Projeden Korunacaklar

Ana projeden korunmasi gereken kritik kisimlar:

- lane-based `BlitzPass`,
- `BlitzCoin` kontrati,
- iki kontrati da deploy eden script,
- `shared/blitzpass.json` ve `shared/blitzcoin.json`,
- `eth_sendRawTransactionSync` destekli relayer,
- `/api/reward`, `/api/buy`, `/api/swap` ayrimi.

Ozellikle `BlitzPass` tarafinda lane modeli korunmali:

```txt
laneOf(eventId, user) -> laneCount[lane]
```

Bu, Monad optimistic parallel execution anlatisi icin en guclu teknik nokta.

## A3 Veri Kaynagi

A3'te localStorage ana veri kaynagi olmamali.

Dogru kaynaklar:

```solidity
BlitzCoin.balancesOf(user, coinIds)
BlitzCoin.swap(fromCoinId, toCoinId, amount)
BlitzCoin.buy(productId, coinId, price)
Purchased(productId, user, coinId, price, timestamp)
```

localStorage sadece sunlar icin kullanilabilir:

- aktif adres,
- dil tercihi,
- basarili islem sonrasi gecici UI cache.

Balance ve siparis zincirden gelmeli.

## A3 Entegrasyon Gorevleri

1. Ana projede shared artifact formatini netlestir.

```json
{
  "address": "0x...",
  "chainId": 10143,
  "rpcUrl": "https://testnet-rpc.monad.xyz",
  "explorerUrl": "https://testnet.monadexplorer.com",
  "coinIds": {},
  "abi": []
}
```

2. A1 reward akisini `BlitzCoin.reward` uzerinden calistir.

3. A1'de market linkini hardcoded yapma. Final entegre yapida link:

```txt
/market?addr=0xUSER
```

4. A2 market UI'ini ana proje route'larina tasi:

```txt
/market
/wallet
/tickets
```

5. Market balance okumasini `balancesOf` ile zincire bagla.

6. Swap ve buy islemlerini ana projenin sync receipt relayer'i ile calistir.

7. Receipt kartinda Monad bilgilerini goster:

- status,
- block number,
- gas used,
- transaction hash,
- explorer link,
- sync veya fallback modu.

8. TR/EN dil secimini ana projeye ekle.

9. UI metinlerini sade tut. Sunum icin cok fazla sembol, ok isareti veya dekoratif ifade kullanma.

10. README'ye demo akisinin kisa versiyonunu ekle.

## A3 Demo Akisi

Sunumda anlatilacak temiz demo:

```txt
1. Kullanici BlitzPass etkinligine girer.
2. Pass claim eder.
3. BlitzCoin reward zincirde olusur.
4. Ayni adresle market acilir.
5. Market balance'i zincirden okur.
6. Kullanici coin swap eder.
7. Kullanici urun satin alir.
8. Receipt ekrani Monad islem bilgisini gosterir.
9. Orders/tickets sayfasi Purchased eventlerinden olusur.
```

## A3 Hazirlik Kriterleri

A3 hazir sayilmasi icin:

- deploy sonrasi iki kontratin adresi de dolu olmali,
- pass, reward, market ve wallet ayni adresi kullanmali,
- reward islemi `BlitzCoin` kontratina gitmeli,
- market balance'i zincirden okumali,
- buy ve swap zincirde calismali,
- receipt ekrani Monad islem detaylarini gostermeli,
- siparisler `Purchased` eventlerinden okunmali,
- TR/EN dil ozelligi calismali,
- herhangi bir private key veya gizli bilgi commit edilmemeli,
- public repo ve live deployment sunuma hazir olmali.

## Onerilen Commit Sirasi

```txt
docs: define a3 integration scope
fix: route rewards through coin contract
feat: add shared market identity bridge
feat: read market balances from blitzcoin
feat: show transaction receipts in checkout
feat: add bilingual market copy
docs: add demo flow
```

