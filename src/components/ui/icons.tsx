import type { IconType } from 'react-icons'
import { FaJava } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import {
  SiBootstrap,
  SiCisco,
  SiCplusplus,
  SiCss,
  SiFlask,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiKeras,
  SiMysql,
  SiOpencv,
  SiPandas,
  SiPhp,
  SiPython,
  SiReact,
  SiTensorflow,
  SiXampp,
} from 'react-icons/si'
import { TbBrandVscode } from 'react-icons/tb'
import type { SkillIcon } from '../../data/resume'

/** Brand icons for each skill, with each brand's own colour for hover/accents. */
export const skillIcons: Record<SkillIcon, { Icon: IconType; color: string }> = {
  python: { Icon: SiPython, color: '#4b8bbe' },
  cpp: { Icon: SiCplusplus, color: '#659ad2' },
  java: { Icon: FaJava, color: '#f89820' },
  html: { Icon: SiHtml5, color: '#e34f26' },
  css: { Icon: SiCss, color: '#663399' },
  javascript: { Icon: SiJavascript, color: '#f7df1e' },
  php: { Icon: SiPhp, color: '#8892bf' },
  mysql: { Icon: SiMysql, color: '#4479a1' },
  flask: { Icon: SiFlask, color: '#e6edf3' },
  bootstrap: { Icon: SiBootstrap, color: '#7952b3' },
  pandas: { Icon: SiPandas, color: '#e70488' },
  react: { Icon: SiReact, color: '#61dafb' },
  tensorflow: { Icon: SiTensorflow, color: '#ff6f00' },
  keras: { Icon: SiKeras, color: '#d00000' },
  opencv: { Icon: SiOpencv, color: '#5c3ee8' },
  git: { Icon: SiGit, color: '#f05032' },
  vscode: { Icon: TbBrandVscode, color: '#3ea6f0' },
  xampp: { Icon: SiXampp, color: '#fb7a24' },
  cisco: { Icon: SiCisco, color: '#1ba0d7' },
  excel: { Icon: PiMicrosoftExcelLogo, color: '#21a366' },
}
