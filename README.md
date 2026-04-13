# GT-Eliminator 🏆

GT-Eliminator 是一个基于 Vue 3 的锦标赛 bracket 组件，支持单淘汰赛和大逃杀模式（每场比赛3+支队伍）。

## ✨ 特性

- **大逃杀模式**：当任何比赛包含超过两支队伍时，自动切换到列表视图
- **轮次标题控制**：轻松自定义轮次标题的颜色、边框和最小宽度
- **可定制的列表视图**：通过 props 调整标签、表头和边框颜色
- **响应式设计**：适用于各种屏幕尺寸，大逃杀列表为全宽
- **获胜者/失败者状态**：内置可视化状态，可通过自定义类扩展
- **灵活的数据结构**：支持基于轮次或扁平树的输入

## 🚀 安装

```bash
# 从本地组件导入
import Bracket from "@/components/gt-eliminator/Bracket.vue";
```

## 📋 基本使用

```vue
<template>
  <Bracket :rounds="rounds">
    <template #team="{ team }">
      {{ team.name }}
    </template>
  </Bracket>
</template>

<script setup>
import Bracket from "@/components/gt-eliminator/Bracket.vue";

const rounds = [
  {
    matches: [
      {
        team1: { id: '1', name: 'Team A', winner: true },
        team2: { id: '2', name: 'Team B', winner: false }
      }
    ]
  }
];
</script>
```

## 🎨 使用 Props 进行样式定制（无主题）

通过简单的 props 来定制所有样式，无需全局主题。

### 核心布局和颜色

| Prop | 类型 | 默认值 | 控制内容 |
|------|------|---------|------------------|
| `backgroundColor` | String | `#ffffff` | 比赛框背景（经典1v1） |
| `textColor` | String | `#ffffff` | 比赛框内的文本颜色 |
| `winnerColor` | String | `#501696` | 获胜者背景（经典1v1） |
| `defeatedColor` | String | `#501696` | 失败者背景（经典1v1） |
| `borderColor` | String | `#501696` | 比赛框和分隔线的边框颜色 |
| `borderRadius` | String | `6px` | 比赛框和标题的圆角 |
| `spacing` | String | `12px` | 项目/轮次之间的垂直间距 |
| `fontSize` | String | `14px` | 基础字体大小 |
| `playerPadding` | String | `8px 12px` | 比赛框内的内边距 |
| `teamPadding` | String | `8px 12px` | 队伍框内的内边距（覆盖 playerPadding） |
| `itemWidth` | String | `120px` | 队伍名称和比赛信息容器的宽度 |
| `roundTitleWidth` | String | `200rpx` | 轮次标题的宽度 |
| `roundTitleSpacing` | String | `''` | 轮次标题之间的间距，默认为 itemWidth 的 1/3 |
| `rankingCount` | Number | `2` | 排名数量，如果设置为 4，会在决赛后添加季军赛 |

### Bracket 连接线（经典模式）

| Prop | 类型 | 默认值 | 控制内容 |
|------|------|---------|------------------|
| `connectionColor` | String | `#85E642` | 比赛之间连接线的颜色 |
| `connectionWidth` | String | `24px` | 水平连接线长度 |
| `connectionThickness` | String | `1px` | 连接线厚度 |

### 轮次标题

| Prop | 类型 | 默认值 | 控制内容 |
|------|------|---------|------------------|
| `roundTitleColor` | String | `#64748b` | 标题文本颜色 |
| `roundTitleBgColor` | String | `#f8fafc` | 标题背景 |
| `roundTitleBorderColor` | String | `#e2e8f0` | 标题边框 |
| `roundTitleMinWidth` | String | `177px` | 标题列最小宽度 |

### 比赛信息样式

| Prop | 类型 | 默认值 | 控制内容 |
|------|------|---------|------------------|
| `matchInfoBg` | String | `#ffffff` | 比赛信息区域背景颜色 |
| `matchInfoFontColor` | String | `#000000` | 比赛信息区域字体颜色 |

### 队伍悬停效果

| Prop | 类型 | 默认值 | 控制内容 |
|------|------|---------|------------------|
| `winnerTeamHover` | String | `rgba(0, 0, 0, 0.1)` | 获胜队伍的悬停颜色 |
| `defeatedTeamHover` | String | `rgba(0, 0, 0, 0.1)` | 失败队伍的悬停颜色 |

### 滚动条定制

| Prop | 类型 | 默认值 | 控制内容 |
|------|------|---------|------------------|
| `scrollbarColor` | String | `#cbd5e1` | 滚动条主颜色 |
| `scrollbarTrackColor` | String | `#f1f5f9` | 滚动条轨道背景 |

### 大逃杀模式 – 标签（轮次/比赛）

| Prop | 类型 | 默认值 |
|------|------|---------|
| `brTabBg` | String | `#1A1A1A` |
| `brTabTextColor` | String | `#ffffff` |
| `brTabActiveBg` | String | `#8200DB` |
| `brTabActiveTextColor` | String | `#ffffff` |

### 大逃杀模式 – 表头

| Prop | 类型 | 默认值 |
|------|------|---------|
| `brTableHeadBg` | String | `#1C1C1C` |
| `brTableHeadTextColor` | String | `#ffffff` |

### 大逃杀模式 – 队伍列表

| Prop | 类型 | 默认值 | 控制内容 |
|------|------|---------|------------------|
| `brListBg` | String | `#000000` | 列表背景 |
| `brListTextColor` | String | `#ffffff` | 列表文本颜色 |
| `brListRowBg` | String | `''` | 单个行背景（默认为 brListBg） |
| `brListRowHoverBg` | String | `''` | 行悬停背景（默认为 #2A2A2A） |
| `brRowDividerColor` | String | `#1C1C1C` | 行分隔线 |

### 插槽

- `#team`：自定义队伍行的渲染。
  - 接收 `team` 对象作为参数

- `#match-info`：自定义比赛信息区域的渲染。
  - 接收 `match` 对象作为参数，包含比赛的所有数据（如 `time`、`venue`、`matchId` 等）

```vue
<template #team="{ team }">
  {{ team.name }}
</template>

<template #match-info="{ match }">
  <div class="match-info">
    <div v-if="match.time">{{ match.time }}</div>
    <div v-if="match.venue">{{ match.venue }}</div>
    <div v-if="match.matchId">Match {{ match.matchId }}</div>
  </div>
</template>
```

### 工具类

| Prop | 类型 | 默认值 | 说明 |
|------|------|---------|------|
| `rounds` | Array | `[]` | 主要输入（支持带有 `team1`/`team2` 的经典 `matches`，或大逃杀模式的 `teams` 数组） |
| `flatTree` | Array | `[]` | 替代输入格式（扁平树） |
| `wrapperClass` | String | `''` | 根包装器上的额外类 |
| `wrapperStyle` | Object | `{}` | 根包装器的内联样式 |
| `customClasses` | Object | `{}` | `{ wrapper, item, itemParent, itemChild, player, winner, defeated, team }` 覆盖 |

你只需要传递你需要的属性，所有属性都有合理的默认值。

## 📚 API 参考

请参阅上面的 props 表格。大多数样式可以通过绑定响应式值在运行时更改。

### 自定义样式对象

```javascript
{
  backgroundColor: '#999999',           // 玩家容器背景
  textColor: 'white',                  // 文本颜色
  winnerColor: 'darkgreen',            // 获胜者背景颜色
  defeatedColor: 'firebrick',          // 失败者背景颜色
  winnerTeamHover: 'rgba(0,0,0,0.1)', // 获胜者悬停颜色
  defeatedTeamHover: 'rgba(0,0,0,0.1)', // 失败者悬停颜色
  connectionColor: 'gray',             // Bracket 连接线颜色
  borderRadius: '0px',                 // 玩家容器的边框半径
  spacing: '10px',                     // 元素之间的间距
  fontSize: '14px',                    // 字体大小
  teamPadding: '8px 12px',            // 队伍内边距（覆盖 playerPadding）
  scrollbarColor: '#cbd5e1',          // 滚动条颜色
  scrollbarTrackColor: '#f1f5f9'      // 滚动条轨道颜色
}
```

### 自定义类对象

```javascript
{
  wrapper: '',        // 包装器容器类
  item: '',          // Bracket 项目类
  itemParent: '',    // 父 Bracket 项目类
  itemChild: '',     // 子 Bracket 项目类
  player: '',        // 玩家容器类
  winner: '',        // 获胜者玩家类
  defeated: ''       // 失败者玩家类
}
```

### 数据结构

经典 1v1
```js
[
  {
    matches: [
      {
        team1: { id: '1', name: 'Team A', winner: true },
        team2: { id: '2', name: 'Team B', winner: false },
        round: '1/4决赛' // 可选：轮次名称，会显示在轮次标题中
      }
    ]
  }
]
```

大逃杀模式（3+队伍）
```js
[
  {
    name: '小组赛',
    matches: [
      {
        teams: [
          { id: 't1', name: 'Team 1', points: 10 },
          { id: 't2', name: 'Team 2', points: 14 },
          { id: 't3', name: 'Team 3', points: 9 }
        ]
      }
    ]
  }
]
```

### 队伍对象结构

```ts
type Team = {
  id: string | number
  name: string
  // 可选字段
  winner?: boolean        // 当队伍赢得比赛时为 true
  points?: number         // 在大逃杀列表中显示的数字点数（在经典模式中也支持）
};
```

注意：
- 在经典（1v1）模式中，如果你想在自定义队伍插槽中显示点数，请将可选的 `points` 放在 `team1`/`team2` 上。
- 在大逃杀模式中，`points` 默认显示在右列。

### 大逃杀模式

当任何轮次中的任何比赛使用 `teams` 数组包含超过两支队伍时，大逃杀模式会自动启用。UI 会切换到带有可滚动轮次和比赛按钮的列表视图。

#### 数据格式（大逃杀）

```js
const rounds = [
  {
    name: '小组赛',
    matches: [
      {
        teams: [
          { id: 'g1-1', name: 'Team 1', points: 10 },
          { id: 'g1-2', name: 'Team 2', points: 14 },
          { id: 'g1-3', name: 'Team 3', points: 9 }
        ]
      }
    ]
  }
];
```

#### 插槽（大逃杀）

- `#team`：自定义队伍行的渲染。

```vue
<template #team="{ team }">
  {{ team.name }}
  <!-- 你可以包含徽章、徽标等 -->
  <span v-if="team.points">{{ team.points }}</span>
</template>
```

#### 可定制的 props（轮次标题和大逃杀）

- 轮次标题：`roundTitleColor`、`roundTitleBgColor`、`roundTitleBorderColor`
- 大逃杀标签：`brTabBg`、`brTabTextColor`、`brTabActiveBg`、`brTabActiveTextColor`
- 大逃杀表头：`brTableHeadBg`、`brTableHeadTextColor`
- 大逃杀队伍列表：`brListBg`、`brListTextColor`、`brListRowBg`、`brListRowHoverBg`、`brRowDividerColor`

使用示例：

```vue
<template>
  <Bracket
    :rounds="rounds"
    :round-title-color="'#94a3b8'"
    :round-title-bg-color="'#0f172a'"
    :round-title-border-color="'#1e293b'"
    :winner-team-hover="'rgba(255, 255, 255, 0.1)'"
    :defeated-team-hover="'rgba(255, 0, 0, 0.1)'"
    :br-tab-bg="'#111827'"
    :br-tab-text-color="'#e5e7eb'"
    :br-tab-active-bg="'#374151'"
    :br-tab-active-text-color="'#ffffff'"
    :br-table-head-bg="'#111827'"
    :br-table-head-text-color="'#9ca3af'"
    :br-list-row-bg="'#1f2937'"
    :br-list-row-hover-bg="'#374151'"
    :br-row-divider-color="'#374151'"
  >
    <template #team="{ team }">{{ team.name }}</template>
  </Bracket>
</template>
```

## 🎯 高级示例

### 带队伍徽标的锦标赛

```vue
<template>
  <Bracket :rounds="rounds">
    <template #team="{ team }">
      <div class="team-player">
        <img :src="team.logo" :alt="team.name" class="team-logo" />
        <div class="team-info">
          <div class="team-name">{{ team.name }}</div>
          <div class="team-score">{{ team.score }}</div>
        </div>
      </div>
    </template>
  </Bracket>
</template>

<style scoped>
.team-player {
  display: flex;
  align-items: center;
  gap: 8px;
}

.team-logo {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.team-info {
  flex: 1;
}

.team-name {
  font-weight: bold;
}

.team-score {
  font-size: 0.8em;
  opacity: 0.8;
}
</style>
```

### 响应式 Bracket

```vue
<template>
  <Bracket 
    :rounds="rounds"
    wrapper-class="responsive-bracket"
  >
    <template #team="{ team }">{{ team.name }}</template>
  </Bracket>
</template>

<style scoped>
.responsive-bracket {
  max-width: 100%;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .responsive-bracket {
    font-size: 0.875rem;
  }
}
</style>
```

## 📄 从 vue-tournament-bracket 迁移

GT-Eliminator 设计为与 vue-tournament-bracket 向后兼容。只需替换你的导入并根据需要添加自定义 props：

```javascript
// 之前
import Bracket from 'vue-tournament-bracket';

// 之后
import Bracket from "@/components/gt-eliminator/Bracket.vue";
```

## 📜 许可证

MIT License - 有关详细信息，请参阅 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- 基于 [vue-tournament-bracket](https://github.com/kamilwylegala/vue-tournament-bracket) 的基础构建
- 灵感来自现代锦标赛 bracket 设计
- 感谢 Vue.js 社区提供的惊人生态系统

---

**用 ❤️ 为 Vue.js 社区制作**