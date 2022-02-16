<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统主页</el-breadcrumb-item>
      <el-breadcrumb-item>Git Graph</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <h3>
        Git Graph
        <el-button icon="el-icon-loading">规划中</el-button>
      </h3>
      <el-select>

      </el-select>
    </div>

    <div id="graph-container"></div>
  </div>
</template>
<script>
import { createGitgraph } from '@gitgraph/js'
export default {
  mounted () {
    // Get the graph container HTML element.
    const graphContainer = document.getElementById('graph-container')

    // Instantiate the graph.
    const gitgraph = createGitgraph(graphContainer)

    // Simulate git commands with Gitgraph API.
    const master = gitgraph.branch('master')
    master.commit('Initial commit')

    const featureb = master.branch('featureb')
    const develop = master.branch('develop')
    const featurea = master.branch('feature-a')

    develop.commit('Add develop1')
    featureb.commit('Add featureb-1')
    develop.commit('Add develop2')
    featureb.commit('Add featureb-2')
    featurea.commit('Add featurea-4')
    featurea.commit('Add featurea-2')
    featurea.commit('Add featurea-3')
    develop.commit('Add develop4')
    develop.commit('Add develop5')
    featurea.commit('Add featurea-1')
    master.merge(featurea)
    featureb.commit('Add featureb-3')
    develop.commit('Add develop3')
    master.merge(develop)
    featureb.commit('Add featureb-4')
    master.merge(featureb)
  },
  methods: {
  }
}
</script>
