import { useEffect, useState } from 'react'
import './App.css'

const ANIMALS_API_URL = 'http://localhost:8080/api/animals'
const API_CONNECTION_ERROR_MESSAGE = 'Spring Boot APIに接続できません。バックエンドが起動しているか確認してください。'

// 1. ヘッダーコンポーネント
function Header({ onNavigate }) {
  return (
    <header className="topbar">
      <a
        className="brand"
        href="#list"
        onClick={(e) => {
          e.preventDefault()
          onNavigate('list')
        }}
      >
        保護動物管理システム
      </a>
      <nav className="nav">
        <a
          href="#list"
          onClick={(e) => {
            e.preventDefault()
            onNavigate('list')
          }}
        >
          保護動物一覧
        </a>
        <button type="button" onClick={() => onNavigate('create')}>
          新規登録
        </button>
      </nav>
    </header>
  )
}

// 2. 一覧表示コンポーネント（検索機能・詳細ボタン付き）
function AnimalList({ animals, loading, onSelectAnimal }) {
  const [searchKeyword, setSearchKeyword] = useState('')

  if (loading) {
    return <p className="empty">保護動物データを読み込み中です...</p>
  }

  if (animals.length === 0) {
    return <p className="empty">登録されている保護動物はまだありません。</p>
  }

  // 種類または地域で検索
  const filteredAnimals = animals.filter(
    (animal) =>
      animal.animal_type.includes(searchKeyword) ||
      animal.region.includes(searchKeyword)
  )

  return (
    <>
      <div className="animal-search">
        <input
          value={searchKeyword}
          onChange={(event) => setSearchKeyword(event.target.value)}
          placeholder="動物の種類・地域で検索（例：犬、松山市）"
        />
      </div>

      {filteredAnimals.length === 0 ? (
        <p className="empty">検索条件に一致する保護動物はありません。</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>動物の種類</th>
              <th>保護地域</th>
              <th>性別</th>
              <th>年齢</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnimals.map((animal) => (
              <tr key={animal.animal_id}>
                <td>{animal.animal_id}</td>
                <td>{animal.animal_type}</td>
                <td>{animal.region}</td>
                <td>{animal.malefemale}</td>
                <td>{animal.age !== null ? `${animal.age}歳` : '不明'}</td>
                <td>
                  <button type="button" onClick={() => onSelectAnimal(animal.animal_id)}>
                    詳細を見る
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}

// 3. 詳細表示コンポーネント（編集・削除・一覧へ戻る）
function AnimalDetail({ animal, onEdit, onDelete, onBack }) {
  if (!animal) {
    return <p className="empty">データを読み込み中です...</p>
  }

  return (
    <div className="animal-card">
      <h2>
        ID: {animal.animal_id} ／ {animal.animal_type}
      </h2>
      <table>
        <tbody>
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
            <td>{animal.age !== null ? `${animal.age}歳` : '未登録'}</td>
          </tr>
          <tr>
            <th>医療・健康情報</th>
            <td>{animal.medical || '特記事項なし'}</td>
          </tr>
          <tr>
            <th>登録利用者ID</th>
            <td>{animal.owner_id}</td>
          </tr>
        </tbody>
      </table>

      <div className="actions" style={{ marginTop: '20px' }}>
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
        <button type="button" className="button-secondary" onClick={onBack}>
          一覧へ戻る
        </button>
      </div>
    </div>
  )
}

// 4. 新規登録・編集兼用フォームコンポーネント
function AnimalForm({ initialData = null, onSubmit, onCancel }) {
  const isEdit = Boolean(initialData)
  const [form, setForm] = useState({
    animal_type: initialData?.animal_type ?? '',
    region: initialData?.region ?? '',
    malefemale: initialData?.malefemale ?? 'オス',
    age: initialData?.age ?? '',
    medical: initialData?.medical ?? '',
  })
  const [submitting, setSubmitting] = useState(false)

  const updateForm = (event) => {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    // ageが空文字ならnull、入力されていれば数値に変換
    const payload = {
      animal_type: form.animal_type,
      region: form.region,
      malefemale: form.malefemale,
      age: form.age === '' ? null : Number(form.age),
      medical: form.medical === '' ? null : form.medical,
    }

    await onSubmit(payload)
    setSubmitting(false)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        <span>
          動物の種類 <span className="required-badge">必須</span>
        </span>
        <input
          name="animal_type"
          value={form.animal_type}
          onChange={updateForm}
          placeholder="例：犬、猫"
          required
        />
      </label>

      <label>
        <span>
          保護地域 <span className="required-badge">必須</span>
        </span>
        <input
          name="region"
          value={form.region}
          onChange={updateForm}
          placeholder="例：愛媛県西予市"
          required
        />
      </label>

      <label>
        <span>
          性別 <span className="required-badge">必須</span>
        </span>
        <select name="malefemale" value={form.malefemale} onChange={updateForm} required>
          <option value="オス">オス</option>
          <option value="メス">メス</option>
          <option value="不明">不明</option>
        </select>
      </label>

      <label>
        年齢（任意・0歳以上）
        <input
          name="age"
          type="number"
          min="0"
          value={form.age}
          onChange={updateForm}
          placeholder="不明な場合は空欄のままにしてください"
        />
      </label>

      <label>
        医療・健康情報（任意）
        <textarea
          name="medical"
          value={form.medical}
          onChange={updateForm}
          placeholder="ワクチン接種状況や持病などを入力してください"
        />
      </label>

      <div className="actions">
        <button type="submit" disabled={submitting}>
          {submitting ? '保存中...' : isEdit ? '更新する' : '登録する'}
        </button>
        <button type="button" className="button-secondary" onClick={onCancel}>
          キャンセル
        </button>
      </div>
    </form>
  )
}

// 5. メインアプリケーション
export default function App() {
  const [view, setView] = useState('list')
  const [animals, setAnimals] = useState([])
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [noticeMessage, setNoticeMessage] = useState('')

  const fetchAnimals = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const response = await fetch(ANIMALS_API_URL)
      if (!response.ok) throw new Error()
      const data = await response.json()
      setAnimals(data)
    } catch {
      setErrorMessage(API_CONNECTION_ERROR_MESSAGE)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnimals()
  }, [])

  const handleSelectAnimal = async (id) => {
    setErrorMessage('')
    setNoticeMessage('')
    try {
      const response = await fetch(`${ANIMALS_API_URL}/${id}`)
      if (!response.ok) throw new Error()
      const data = await response.json()
      setSelectedAnimal(data)
      setView('detail')
    } catch {
      setErrorMessage('詳細データの取得に失敗しました。')
    }
  }

  const handleCreateAnimal = async (payload) => {
    setErrorMessage('')
    try {
      const response = await fetch(ANIMALS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error()
      await fetchAnimals()
      setNoticeMessage('新しい保護動物を登録しました。')
      setView('list')
    } catch {
      setErrorMessage('登録に失敗しました。入力内容を確認してください。')
    }
  }

  const handleUpdateAnimal = async (payload) => {
    setErrorMessage('')
    try {
      const response = await fetch(`${ANIMALS_API_URL}/${selectedAnimal.animal_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error()
      const updated = await response.json()
      setSelectedAnimal(updated)
      await fetchAnimals()
      setNoticeMessage('保護動物情報を更新しました。')
      setView('detail')
    } catch {
      setErrorMessage('更新に失敗しました。入力内容を確認してください。')
    }
  }

  const handleDeleteAnimal = async (id) => {
    if (!window.confirm(`ID: ${id} の保護動物データを削除してもよろしいですか？`)) return
    setErrorMessage('')
    try {
      const response = await fetch(`${ANIMALS_API_URL}/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error()
      await fetchAnimals()
      setNoticeMessage('保護動物データを削除しました。')
      setView('list')
    } catch {
      setErrorMessage('削除に失敗しました。')
    }
  }

  const navigateTo = (nextView) => {
    setErrorMessage('')
    setNoticeMessage('')
    setView(nextView)
  }

  return (
    <>
      <Header onNavigate={navigateTo} />
      <main className={`container ${view === 'create' || view === 'edit' ? 'narrow' : ''}`}>
        <section className="page-head">
          <h1>
            {view === 'list' && '保護動物一覧'}
            {view === 'detail' && '保護動物詳細'}
            {view === 'create' && '保護動物 新規登録'}
            {view === 'edit' && '保護動物 編集'}
          </h1>
          <p>
            {view === 'list' && '登録されている保護動物の一覧です。「詳細を見る」から編集・削除が行えます。'}
            {view === 'detail' && '保護動物の詳細情報です。'}
            {view === 'create' && '新しい保護動物の情報を入力して登録してください。'}
            {view === 'edit' && '内容を修正して「更新する」を押してください。'}
          </p>
        </section>

        {errorMessage && <p className="alert">{errorMessage}</p>}
        {noticeMessage && <p className="notice">{noticeMessage}</p>}

        {view === 'list' && (
          <AnimalList animals={animals} loading={loading} onSelectAnimal={handleSelectAnimal} />
        )}

        {view === 'detail' && (
          <AnimalDetail
            animal={selectedAnimal}
            onEdit={() => setView('edit')}
            onDelete={handleDeleteAnimal}
            onBack={() => navigateTo('list')}
          />
        )}

        {view === 'create' && (
          <AnimalForm onSubmit={handleCreateAnimal} onCancel={() => navigateTo('list')} />
        )}

        {view === 'edit' && (
          <AnimalForm
            initialData={selectedAnimal}
            onSubmit={handleUpdateAnimal}
            onCancel={() => setView('detail')}
          />
        )}
      </main>
    </>
  )
}

// 一覧表示をカード形式にしたいとき
//<section className="grid">
//  {filteredAnimals.map((animal) => (
//    <article className="animal-card" key={animal.animal_id}>
//      <h2>{animal.animal_type}（{animal.malefemale}）</h2>
//      <p>地域：{animal.region}</p>
//      <p>年齢：{animal.age !== null ? `${animal.age}歳` : '不明'}</p>
//      <div style={{ marginTop: '12px' }}>
//        <button type="button" onClick={() => onSelectAnimal(animal.animal_id)}>
//          詳細を見る
//        </button>
//      </div>
//    </article>
//  ))}
//</section>
