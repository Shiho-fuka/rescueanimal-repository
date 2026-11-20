import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL = "http://localhost:8080/api";
const ANIMALS_API_URL = `${API_BASE_URL}/animals`;
const AUTH_STATUS_URL = `${API_BASE_URL}/auth/status`;
const LOGIN_URL = `${API_BASE_URL}/login`;
const LOGOUT_URL = `${API_BASE_URL}/logout`;
const API_CONNECTION_ERROR_MESSAGE =
  "Spring Boot APIに接続できません。バックエンドが起動しているか確認してください。";

// 1. ヘッダーコンポーネント
function Header({ auth, onNavigate, onLogout }) {
  return (
    <header className="topbar">
      <a
        className="brand"
        href="#list"
        onClick={(e) => {
          e.preventDefault();
          onNavigate("list");
        }}
      >
        🐶「殺処分ゼロを目指すサイト」🐱
      </a>
      <nav className="nav">
        <a
          href="#list"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("list");
          }}
        >
          保護動物一覧
        </a>

        {!auth.authenticated ? (
          <>
            <span className="login-status">未ログイン状態</span>
            <button type="button" onClick={() => onNavigate("login")}>
              ログイン
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => onNavigate("create")}>
              新規登録
            </button>
            <span className="login-status">
              <span style={{ color: "#d96b27" }}>{auth.username}</span>（ID:{" "}
              {auth.owner_id}）でログイン中
            </span>
            <button
              type="button"
              className="button-secondary"
              onClick={onLogout}
            >
              ログアウト
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

// 2. ログイン画面コンポーネント
function LoginPage({ onLoginSuccess, onCancel }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError(false);
    setSubmitting(true);

    const body = new URLSearchParams();
    body.append("username", username);
    body.append("password", password);

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body,
      });

      if (!response.ok) {
        setLoginError(true);
        setSubmitting(false);
        return;
      }

      await onLoginSuccess();
    } catch {
      setLoginError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleLogin}>
      {loginError && (
        <p className="alert">ユーザー名またはパスワードが違います。</p>
      )}

      <label>
        ユーザー名
        <input
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="例：user101"
          required
        />
      </label>

      <label>
        パスワード
        <div className="password-field">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワードを入力してください"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "非表示" : "表示"}
          </button>
        </div>
      </label>

      <p className="form-help">
        ※テスト用アカウント：user101 / user102 / user103（パスワード：password）
      </p>

      <div className="actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "ログイン中..." : "ログイン"}
        </button>
        <button type="button" className="button-secondary" onClick={onCancel}>
          一覧へ戻る
        </button>
      </div>
    </form>
  );
}

// 3. 一覧表示コンポーネント
function AnimalList({ animals, loading, onSelectAnimal }) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6; // 1ページに表示するカード枚数

  if (loading) {
    return <p className="empty">データを読み込み中です...</p>;
  }

  if (animals.length === 0) {
    return <p className="empty">登録されているデータはまだありません。</p>;
  }

  // 種類または地域で絞り込み
  const filteredAnimals = animals.filter(
    (animal) =>
      animal.animal_type.includes(searchKeyword) ||
      animal.region.includes(searchKeyword),
  );

  // 検索ワードが変わったら1ページ目に戻す
  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
    setCurrentPage(1);
  };

  // 総ページ数の計算（最低1ページ）
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAnimals.length / ITEMS_PER_PAGE),
  );
  // 現在のページに表示するデータだけを切り出す
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentAnimals = filteredAnimals.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <>
      <div className="animal-search">
        <input
          value={searchKeyword}
          onChange={handleSearchChange}
          placeholder="動物の種類・地域で検索（例：犬、松山市）"
        />
      </div>

      {filteredAnimals.length === 0 ? (
        <p className="empty">検索条件に一致する保護動物はありません。</p>
      ) : (
        <>
          <section className="grid">
            {currentAnimals.map((animal) => (
              <article className="animal-card" key={animal.animal_id}>
                {animal.image_url ? (
                  <img
                    src={animal.image_url}
                    alt={animal.animal_type}
                    className="animal-card-image"
                  />
                ) : (
                  <div className="animal-card-no-image">写真なし</div>
                )}

                <h2>
                  {animal.animal_type} (
                  {animal.malefemale === "オス"
                    ? "♂"
                    : animal.malefemale === "メス"
                      ? "♀"
                      : "性別不明"}
                  )
                </h2>
                <p className="animal-card-meta">保護地域：{animal.region}</p>
                <p className="animal-card-meta">年齢：{animal.age || "不明"}</p>

                <div style={{ marginTop: "14px" }}>
                  <button
                    type="button"
                    style={{ width: "100%" }}
                    onClick={() => onSelectAnimal(animal.animal_id)}
                  >
                    詳細を見る
                  </button>
                </div>
              </article>
            ))}
          </section>

          {/* ページが2ページ以上ある場合、または件数確認用にページ切り替えを表示 */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                ← 前のページ
              </button>

              <span className="pagination-info">
                {currentPage} / {totalPages} ページ（全 {filteredAnimals.length}{" "}
                件）
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                次のページ →
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

// 4. 詳細表示コンポーネント
function AnimalDetail({ animal, isAuthenticated, onEdit, onDelete, onBack }) {
  if (!animal) {
    return <p className="empty">データを読み込み中です...</p>;
  }

  return (
    <div className="animal-card">
      <h2>
        ID: {animal.animal_id} ／ {animal.animal_type} (
        {animal.malefemale === "オス"
          ? "♂"
          : animal.malefemale === "メス"
            ? "♀"
            : "性別不明"}
        )
      </h2>

      <table>
        <tbody>
          <tr>
            <th>写真</th>
            <td>
              {animal.image_url ? (
                <img
                  src={animal.image_url}
                  alt={animal.animal_type}
                  className="animal-detail-image"
                />
              ) : (
                "未登録"
              )}
            </td>
          </tr>
          <tr>
            <th>保護地域</th>
            <td>{animal.region}</td>
          </tr>
          <tr>
            <th>性別</th>
            <td>{animal.malefemale}</td>
          </tr>
          <tr>
            <th>年齢</th>
            <td>{animal.age || "未登録"}</td>
          </tr>
          <tr>
            <th>特徴・健康状態</th>
            <td>{animal.medical || "特記事項なし"}</td>
          </tr>
          <tr>
            <th>情報掲載日</th>
            <td>{animal.posted_date}</td>
          </tr>
          <tr>
            <th>登録利用者ID</th>
            <td>{animal.owner_id}</td>
          </tr>
        </tbody>
      </table>

      <div className="actions" style={{ marginTop: "20px" }}>
        {isAuthenticated && (
          <>
            <button type="button" onClick={onEdit}>
              編集する
            </button>
            <button
              type="button"
              className="button-danger"
              onClick={() => onDelete(animal.animal_id)}
            >
              削除する
            </button>
          </>
        )}
        <button type="button" className="button-secondary" onClick={onBack}>
          一覧へ戻る
        </button>
      </div>
    </div>
  );
}

// 5. 新規登録・編集用フォームコンポーネント
function AnimalForm({ initialData = null, onSubmit, onCancel }) {
  const isEdit = Boolean(initialData);
  const [form, setForm] = useState({
    animal_type: initialData?.animal_type ?? "成犬",
    region: initialData?.region ?? "",
    malefemale: initialData?.malefemale ?? "オス",
    age: initialData?.age ?? "",
    medical: initialData?.medical ?? "",
    image_url: initialData?.image_url ?? "",
  });
  const [validationErrors, setValidationErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        image_url: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setForm((current) => ({
      ...current,
      image_url: "",
    }));
  };

  // 入力項目のバリデーションチェック
  const validateForm = () => {
    const errors = [];
    if (!form.animal_type || !form.animal_type.trim()) {
      errors.push("動物の種類の入力は必須です。");
    }
    if (!form.region || !form.region.trim()) {
      errors.push("地域の入力は必須です。");
    } else if (form.region.trim().length > 20) {
      errors.push("地域は20文字以内で入力してください。");
    }
    if (!form.malefemale || !form.malefemale.trim()) {
      errors.push("性別の選択は必須です。");
    }
    if (form.age && form.age.trim().length > 50) {
      errors.push("年齢は50文字以内で入力してください。");
    }
    if (form.medical && form.medical.trim().length > 255) {
      errors.push("医療・健康情報は255文字以内で入力してください。");
    }
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);
    setSubmitting(true);

    const payload = {
      animal_type: form.animal_type.trim(),
      region: form.region.trim(),
      malefemale: form.malefemale.trim(),
      age: form.age.trim() === "" ? null : form.age.trim(),
      medical: form.medical.trim() === "" ? null : form.medical.trim(),
      image_url: form.image_url === "" ? null : form.image_url,
    };

    await onSubmit(payload);
    setSubmitting(false);
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {validationErrors.length > 0 && (
        <div className="alert">
          {validationErrors.map((err, index) => (
            <p key={index} style={{ margin: "4px 0" }}>
              ・{err}
            </p>
          ))}
        </div>
      )}

      <label>
        <span>
          動物の種類 <span className="required-badge">必須</span>
        </span>
        <select
          name="animal_type"
          value={form.animal_type}
          onChange={updateForm}
        >
          <option value="成犬">成犬</option>
          <option value="子犬">子犬</option>
          <option value="成猫">成猫</option>
          <option value="子猫">子猫</option>
          <option value="その他">その他</option>
        </select>
      </label>

      <label>
        <span>
          保護地域（20文字以内） <span className="required-badge">必須</span>
        </span>
        <input
          name="region"
          value={form.region}
          onChange={updateForm}
          placeholder="例：愛媛県西予市"
        />
      </label>

      <label>
        <span>
          性別 <span className="required-badge">必須</span>
        </span>
        <select name="malefemale" value={form.malefemale} onChange={updateForm}>
          <option value="オス">オス</option>
          <option value="メス">メス</option>
          <option value="不明">不明</option>
        </select>
      </label>

      <label>
        年齢（任意・50文字以内）
        <input
          name="age"
          value={form.age}
          onChange={updateForm}
          placeholder="例：3歳、生後半年（不明な場合は空欄）"
        />
      </label>

      <label>
        特徴・健康状態（任意・255文字以内）
        <textarea
          name="medical"
          value={form.medical}
          onChange={updateForm}
          placeholder="特徴、ワクチン接種状況・持病などの情報入力欄"
        />
      </label>

      <label>
        保護動物の写真（任意）
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {form.image_url && (
          <div className="image-preview-box">
            <img src={form.image_url} alt="プレビュー" />
            <button
              type="button"
              className="button-secondary"
              onClick={handleRemoveImage}
            >
              画像を削除する
            </button>
          </div>
        )}
      </label>

      <div className="actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "保存中..." : isEdit ? "更新する" : "登録する"}
        </button>
        <button type="button" className="button-secondary" onClick={onCancel}>
          キャンセル
        </button>
      </div>
    </form>
  );
}

// 6. メインアプリケーション
export default function App() {
  const [view, setView] = useState("list"); // 'list' | 'detail' | 'create' | 'edit' | 'login'
  const [auth, setAuth] = useState({
    authenticated: false,
    username: "",
    owner_id: "",
  });
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");

  // ログイン状態の確認
  const fetchAuthStatus = async () => {
    try {
      const response = await fetch(AUTH_STATUS_URL, { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setAuth(data);
      }
    } catch {
      // 接続エラーは一覧取得側で表示するためここでは無視
    }
  };

  // 一覧取得
  const fetchAnimals = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch(ANIMALS_API_URL, { credentials: "include" });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setAnimals(data);
    } catch {
      setErrorMessage(API_CONNECTION_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthStatus();
    fetchAnimals();
  }, []);

  // ログイン成功時の処理
  const handleLoginSuccess = async () => {
    await fetchAuthStatus();
    setErrorMessage("");
    setNoticeMessage(
      "ログインしました。保護動物の新規登録・編集・削除が行えます。",
    );
    setView("list");
  };

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await fetch(LOGOUT_URL, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setAuth({ authenticated: false, username: "", owner_id: "" });
      setErrorMessage("");
      setNoticeMessage("ログアウトしました。");
      setView("list");
    }
  };

  // 詳細取得
  const handleSelectAnimal = async (id) => {
    setErrorMessage("");
    setNoticeMessage("");
    try {
      const response = await fetch(`${ANIMALS_API_URL}/${id}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setSelectedAnimal(data);
      setView("detail");
    } catch {
      setErrorMessage("詳細データの取得に失敗しました。");
    }
  };

  // 新規登録
  const handleCreateAnimal = async (payload) => {
    setErrorMessage("");
    try {
      const response = await fetch(ANIMALS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error();
      await fetchAnimals();
      setNoticeMessage("新しい保護動物を登録しました。");
      setView("list");
    } catch {
      setErrorMessage(
        "登録に失敗しました。ログイン状態と入力内容を確認してください。",
      );
    }
  };

  // 更新
  const handleUpdateAnimal = async (payload) => {
    setErrorMessage("");
    try {
      const response = await fetch(
        `${ANIMALS_API_URL}/${selectedAnimal.animal_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok) throw new Error();
      const updated = await response.json();
      setSelectedAnimal(updated);
      await fetchAnimals();
      setNoticeMessage("保護動物情報を更新しました。");
      setView("detail");
    } catch {
      setErrorMessage(
        "更新に失敗しました。ログイン状態と入力内容を確認してください。",
      );
    }
  };

  // 削除
  const handleDeleteAnimal = async (id) => {
    const isOtherOwner =
      selectedAnimal &&
      Number(selectedAnimal.owner_id) !== Number(auth.owner_id);

    const confirmMessage = isOtherOwner
      ? `⚠️ この動物は別の利用者（ID: ${selectedAnimal.owner_id})が登録しています。\n本当に削除してもよろしいですか？`
      : `ID: ${id} の保護動物データを削除してもよろしいですか？`;

    if (!window.confirm(confirmMessage)) return;
    setErrorMessage("");
    try {
      const response = await fetch(`${ANIMALS_API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error();
      await fetchAnimals();
      setNoticeMessage("保護動物データを削除しました。");
      setView("list");
    } catch {
      setErrorMessage("削除に失敗しました。");
    }
  };

  const navigateTo = (nextView) => {
    setErrorMessage("");
    setNoticeMessage("");
    setView(nextView);
  };

  return (
    <>
      <Header auth={auth} onNavigate={navigateTo} onLogout={handleLogout} />

      <main
        className={`container ${view === "create" || view === "edit" || view === "login" ? "narrow" : ""}`}
      >
        <section className="page-head">
          <h1>
            {view === "list" && "🐾 里親募集中！🐾"}
            {view === "detail" && "🐾 詳細情報 🐾"}
            {view === "create" && "🐾 新規登録 🐾"}
            {view === "edit" && "🐾 編　集 🐾"}
            {view === "login" && "利用者ログイン"}
          </h1>
          <p>
            {view === "list" &&
              (auth.authenticated
                ? "登録されている保護動物の一覧です。「詳細を見る」から編集・削除が行えます。"
                : "登録されている保護動物の一覧です。登録・編集・削除を行うにはログインしてください。")}
            {view === "detail" && "保護動物の詳細情報です。"}
            {view === "create" &&
              "新しい保護動物の情報を入力して登録してください。"}
            {view === "edit" && "内容を修正して「更新する」を押してください。"}
            {view === "login" && "ユーザー名とパスワードを入力してください。"}
          </p>
        </section>

        {errorMessage && <p className="alert">{errorMessage}</p>}
        {noticeMessage && <p className="notice">{noticeMessage}</p>}

        {view === "login" && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => navigateTo("list")}
          />
        )}

        {view === "list" && (
          <AnimalList
            animals={animals}
            loading={loading}
            onSelectAnimal={handleSelectAnimal}
          />
        )}

        {view === "detail" && (
          <AnimalDetail
            animal={selectedAnimal}
            isAuthenticated={auth.authenticated}
            onEdit={() => {
              if (Number(selectedAnimal.owner_id) !== Number(auth.owner_id)) {
                const ok = window.confirm(
                  `⚠️ この動物は別の利用者（ID: ${selectedAnimal.owner_id}）が登録しています。\n本当に編集しますか？`,
                );
                if (!ok) return;
              }
              setView("edit");
            }}
            onDelete={handleDeleteAnimal}
            onBack={() => navigateTo("list")}
          />
        )}

        {view === "create" && (
          <AnimalForm
            onSubmit={handleCreateAnimal}
            onCancel={() => navigateTo("list")}
          />
        )}

        {view === "edit" && (
          <AnimalForm
            initialData={selectedAnimal}
            onSubmit={handleUpdateAnimal}
            onCancel={() => setView("detail")}
          />
        )}
      </main>
    </>
  );
}
