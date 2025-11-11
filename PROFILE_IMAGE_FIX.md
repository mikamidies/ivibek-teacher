# ✅ Исправление проблемы с изображением профиля

## 🎯 Проблема

Фото профиля пропадало после перезагрузки страницы из-за:

1. **Бесконечная рекурсия** - `fetchUser()` вызывал сам себя при ошибке 401
2. **Отсутствие защиты от множественных вызовов** - `fetchUser()` мог вызываться несколько раз одновременно
3. **Неполный URL изображения** - API возвращает относительный путь, нужен полный URL
4. **Недостаточное логирование** - было сложно отследить проблему

## 🔧 Исправления

### 1. Добавлена защита от бесконечной рекурсии в `fetchUser()`

**Было:**

```typescript
catch (error: any) {
  if (error.statusCode === 401) {
    const refreshed = await refresh();
    if (refreshed) {
      await fetchUser(); // ❌ РЕКУРСИЯ!
    }
  }
}
```

**Стало:**

```typescript
let isFetchingUser = false;

const fetchUser = async () => {
  if (isFetchingUser) {
    console.log("⏳ fetchUser already in progress, skipping...");
    return;
  }

  isFetchingUser = true;

  try {
    // ... код ...
  } catch (error: any) {
    if (error.statusCode === 401) {
      const refreshed = await refresh();
      if (!refreshed) {
        logout();
      }
      // ✅ НЕ повторяем запрос - refresh уже установил user.value
    }
  } finally {
    isFetchingUser = false;
  }
};
```

### 2. Улучшено логирование в `fetchUser()` и `refresh()`

Теперь все ключевые события логируются:

- 📥 `Fetching user profile...` - начало загрузки профиля
- ⏳ `fetchUser already in progress, skipping...` - защита от дублей
- ⏰ `Access token expired, refreshing before fetch...` - токен истёк
- ✅ `User profile loaded: ...` - профиль загружен
- 🖼️ `User image: ...` - путь к изображению
- ❌ `Failed to fetch user: ...` - ошибка загрузки
- 🔒 `Got 401 in fetchUser, attempting token refresh...` - получен 401

### 3. Добавлена функция `getImageUrl()` для полного URL

**Проблема:** API возвращает относительный путь типа `/uploads/images/user123.jpg`

**Решение:**

```typescript
const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) {
    return "/images/default-person.jpg";
  }

  // Если путь уже полный URL
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Если путь относительный - добавляем базовый URL
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${API_BASE}${cleanPath}`;
};

// Computed свойство для удобства
const userImageUrl = computed(() => getImageUrl(user.value?.image));
```

### 4. Обновлены все компоненты для использования `userImageUrl`

**Компоненты:**

- `components/cards/PersonalCard.vue`
- `components/cards/MyInfoCard.vue`
- `pages/profile.vue`

**Было:**

```vue
<img :src="user?.image || '/images/default-person.jpg'" />
```

**Стало:**

```vue
<script setup>
const { userImageUrl } = useAuth();
</script>

<template>
  <img :src="userImageUrl" />
</template>
```

### 5. Улучшено логирование в `refresh()`

```typescript
const refresh = async (): Promise<boolean> => {
  console.log("🔄 Refreshing tokens...");

  // ... код обновления ...

  if (data.user) {
    user.value = data.user;
    console.log("✅ User data received in refresh response");
    console.log("🖼️ User image from refresh:", data.user.image);
  }

  console.log("✅ Tokens refreshed successfully");
};
```

---

## 📊 Новые экспортируемые функции из `useAuth()`

```typescript
return {
  user,
  userImageUrl, // ✅ Новое - computed URL изображения
  accessToken,
  refreshToken,
  login,
  register,
  refresh,
  fetchUser,
  updateProfile,
  updateProfileImage,
  updateAbout,
  resetPassword,
  logout,
  getImageUrl, // ✅ Новое - функция для преобразования пути в URL
};
```

---

## 🧪 Тестирование

### Сценарии:

1. **Загрузка профиля**

   - Войти в систему
   - ✅ Фото должно загрузиться
   - Проверить в консоли логи: `📥 Fetching user profile...` → `✅ User profile loaded` → `🖼️ User image: ...`

2. **Перезагрузка страницы**

   - Обновить страницу (F5)
   - ✅ Фото должно остаться
   - Проверить консоль на отсутствие ошибок

3. **Истечение токена**

   - Подождать истечения токена
   - ✅ Токен должен обновиться автоматически
   - ✅ Фото должно остаться видимым

4. **Загрузка нового фото**
   - Загрузить новое фото через профиль
   - ✅ Фото должно обновиться везде (sidebar, profile, dashboard)
   - ✅ После перезагрузки фото должно остаться

---

## 📝 Изменённые файлы

1. ✅ `composables/auth.ts` - добавлены `getImageUrl()`, `userImageUrl`, улучшены `fetchUser()` и `refresh()`
2. ✅ `components/cards/PersonalCard.vue` - используется `userImageUrl`
3. ✅ `components/cards/MyInfoCard.vue` - используется `userImageUrl`
4. ✅ `pages/profile.vue` - используется `userImageUrl`

---

## ✨ Результат

- ✅ Фото профиля **не пропадает** после перезагрузки
- ✅ Нет бесконечной рекурсии при ошибках
- ✅ Правильный полный URL для изображений
- ✅ Подробное логирование для отладки
- ✅ Защита от множественных одновременных вызовов

**Проблема решена! 🚀**
