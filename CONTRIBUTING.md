
# 🧠 Strategia pracy z Git podczas hackathonu (dla 4 osób)

## 📌 Cel
Zoptymalizować współpracę i rozwój projektu w ograniczonym czasie (20 godzin), minimalizując konflikty i zwiększając szybkość pracy.

---

## 🌿 Model gałęzi — Prosty i skuteczny

Używamy **bardzo uproszczonego modelu**:

- `main` – gotowa wersja do demo/prezentacji
- `dev` – główna gałąź do developmentu
- `feature/nazwa` – gałąź z funkcjonalnością (np. `feature/login`, `feature/api`)

---

## 🔁 Workflow krok po kroku

### 1. 🔄 Pull na start
Każdy zaczyna pracę od:
```bash
git checkout dev
git pull
```

### 2. 🌱 Tworzenie funkcjonalności
Tworzysz nową gałąź z `dev`:
```bash
git checkout -b feature/nazwa
```

### 3. 💻 Praca nad funkcją
Kodujesz, często commitujesz:
```bash
git add .
git commit -m "Dodano funkcję X"
```

### 4. 🔀 Mergowanie do `dev`
Gdy funkcja działa:
```bash
git checkout dev
git pull
git merge feature/nazwa
git push
```

### 5. 💥 Unikamy konfliktów
- Przed mergem **pull z `dev` do feature/**:
  ```bash
  git checkout feature/nazwa
  git pull origin dev
  ```
- Często aktualizujemy `dev`, by zmniejszyć ryzyko konfliktów

---

## 🧪 Testowanie i demo

- Przed końcowym demo: merge `dev` do `main`
- Tylko jedna osoba robi merge `dev → main`, by uniknąć bałaganu

```bash
git checkout main
git pull
git merge dev
git push
```

---

## 📋 Role w zespole

| Osoba | Zadanie |
|-------|--------|
| A | API/backend |
| B | Frontend |
| C | Logika/komponenty współdzielone |
| D | Integracja/testy/merge'y do `main` |

> Można się wymieniać — ważne, by **ktoś ogarniał merge `main`** i porządek.

---

## 🛠️ Przydatne komendy

```bash
git branch -a                  # Zobacz wszystkie gałęzie
git status                     # Zobacz co się zmieniło
git log --oneline --graph      # Wizualizacja historii
git stash                      # Zapisz zmiany na później
```

---

## ✅ Dobre praktyki

- Małe, częste commity
- Opisy commitów w stylu: `Dodano logowanie`, `Naprawiono błąd X`
- Częste mergowanie `dev` do feature, nie odwrotnie
- Unikaj pracy na `main` lub `dev` bezpośrednio
