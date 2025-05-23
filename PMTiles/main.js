// PMTilesの、MapLibre GL JS用のプロトコルをグローバルに追加
let protocol = new pmtiles.Protocol();
// addProtocolで、カスタムURLスキーマを使用するときに呼び出される関数を追加する
// pmtiles://~~ が使用されたときに、protocol.tileが呼び出される
maplibregl.addProtocol("pmtiles", protocol.tile);

const map = new maplibregl.Map({
  container: "map",
  center: [139.7024, 35.6598], // 中心座標
  zoom: 16, // ズームレベル
  style: {
    // スタイル仕様のバージョン番号。8を指定する
    version: 8,
    // データソース
    sources: {
      // 背景地図 OpenStreetMapのラスタタイル
      "background-osm-raster": {
        // ソースの種類。vector、raster、raster-dem、geojson、image、video のいずれか
        type: "raster",
        // タイルソースのURL
        tiles: [
          "https://tile.openstreetmap.jp/styles/osm-bright-ja/{z}/{x}/{y}.png",
        ],
        // タイルの解像度。単位はピクセル、デフォルトは512
        tileSize: 256,
        // データの帰属
        attribution:
          "<a href='https://www.openstreetmap.org/copyright' target='_blank'>© OpenStreetMap contributors</a>",
      },
      "amx-a-pmtiles": {
        type: "vector",
        // タイルが利用可能な最小ズームレベル
        minzoom: 2,
        // タイルが利用可能な最大ズームレベル
        maxzoom: 16,
        // リソースへのURL
        url: "pmtiles://https://habs.rad.naro.go.jp/spatial_data/amx/a.pmtiles",
        attribution:
          "<a href='https://www.moj.go.jp/MINJI/minji05_00494.html' target='_blank'>登記所備付地図データ（法務省）</a>",
      },
    },
    // 表示するレイヤ
    layers: [
      // 背景地図としてOpenStreetMapのラスタタイルを追加
      {
        // 一意のレイヤID
        id: "background-osm-raster",
        // レイヤの種類。background、fill、line、symbol、raster、circle、fill-extrusion、heatmap、hillshade のいずれか
        type: "raster",
        // データソースの指定
        source: "background-osm-raster",
      },
      // 登記所備付地図データ 間引きなし
      {
        id: "amx-a-fude",
        // 塗りつぶされたポリゴン
        type: "fill",
        source: "amx-a-pmtiles",
        // ベクトルタイルソースから使用するレイヤ
        "source-layer": "fude",
        paint: {
          // 塗りつぶし部分の色
          "fill-color": "rgba(254, 217, 192, 1)",
          // 塗りつぶしの輪郭の色
          "fill-outline-color": "rgba(255, 0, 0, 1)",
          // 塗りつぶしの不透明度 1に近づくほど不透明になる
          "fill-opacity": 0.4,
        },
      },
      // 登記所備付地図データ 代表点レイヤ
      {
        id: "amx-a-daihyo",
        // ヒートマップ
        type: "heatmap",
        source: "amx-a-pmtiles",
        // ベクトルタイルソースから使用するレイヤ
        "source-layer": "daihyo",
        paint: {
          // ヒートマップの密度に基づいて各ピクセルの色を定義
          "heatmap-color": [
            // 入力値と出力値のペア（"stop"）の間を補間することにより、連続的で滑らかな結果を生成する
            "interpolate",
            // 入力より小さいストップと大きいストップのペアを直線的に補間
            ["linear"],
            // ヒートマップレイヤーの密度推定値を取得
            ["heatmap-density"],
            0,
            "rgba(255, 255, 255, 0)",
            0.5,
            "rgba(255, 255, 0, 0.5)",
            // 1に近づくほど密度が高い
            1,
            "rgba(255, 0, 0, 0.5)",
          ],
          // ヒートマップ1点の半径（ピクセル単位）
          "heatmap-radius": [
            // 入力値と出力値のペア（"stop"）の間を補間することにより、連続的で滑らかな結果を生成する
            "interpolate",
            // 出力が増加する割合を制御する、1に近づくほど出力が増加する
            ["exponential", 10],
            // ズームレベルに応じて半径を調整する
            ["zoom"],
            2,
            5,
            14,
            50,
          ],
        },
      },
    ],
  },
});
