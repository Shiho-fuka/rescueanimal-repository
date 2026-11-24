# 「保護動物管理システム」

「保護動物管理システム」は、動物の殺処分ゼロを目指して、保護動物の里親を探している人と、里親になることを希望している人をつなぐサービスです。

# サービスへの想い

犬や猫の殺処分は、年々減ってはいるものの何千頭にも上り、特に私の地元である四国は殺処分数ワーストに名を連ねることも多く、殺処分間近となった動物の里親を募る、愛護団体の切実な声が届けられる毎日です。<br>
既に多くの里親募集サイトが存在していますが、狭いケージの中で、自分の命を諦めていかなければならない幾つもの命を救う手助けになればと思い、地元のニーズに合ったシステムを作ることを思い立ちました。<br>
まだ入口しかできていませんし、デザインも垢ぬけておりませんが、利用者の連絡先情報など、利用者管理も整えて、同じ思いの人たちがやり取りできる場になればと考えています。

# 使用技術

- Frontend
  - JavaScript / React / Vite / Node.js
- Backend
  - Java / OpenJDK 21.0.11 / Spring Boot / Spring Data JPA
- Authentication
  - Spring Security
- DataBase
  - H2 Database
- build tool
  - Maven 3.9.9 / npm
- etc.
  - Git / GitHub

# 機能一覧

<img width="1200" height="1880" alt="print_sc" src="https://github.com/user-attachments/assets/7af7e34f-ddac-43d8-870b-324944b03474" />

# ER図

<img width="817" height="582" alt="ER図" src="https://github.com/user-attachments/assets/1a8f9859-6fae-4328-a8ba-6680a9c2f3ca" />

# ローカル環境での起動方法

- 必要環境
  - OpenJDK 21.0.11
  - Node.js 24.21.0
  - IntelliJ IDEA
  - React
  - H2 Database
  - Git

# インストール手順

1. IntelliJ IDEAを起動する

2. リポジトリをクローンする<br>
   ターミナルで作業フォルダへ移動し、以下のコマンドを入力実行する<br>
   git clone https://github.com/Shiho-fuka/rescueanimal-repository.git

3. バックエンド（Spring Boot）を起動する<br>
   ２のプロジェクトを開いてApplicationを実行する

4. フロントエンド（React）を起動する<br>
   以下のコマンドを入力実行する<br>
   cd form-react<br>
   （初回のみ） npm install<br>
   npm run dev

5. http://localhost:5173 が表示されるので Ctrl＋クリックでトップ画面がブラウザに<br>
   表示されることを確認
