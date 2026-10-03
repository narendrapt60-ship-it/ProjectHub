import narenAvatar from './images/avatar_naren_1790769156352.jpg';
import sitiAvatar from './images/avatar_siti_1790769167757.jpg';
import batik from './images/batik_mockup_1790769103394.jpg';
import gradevision from './images/gradevision_mockup_1790769090510.jpg';
import greenschool from './images/greenschool_preview_1790769064439.jpg';
import mathhero from './images/mathhero_mockup_1790769116801.jpg';
import studyflow from './images/studyflow_mockup_1790769077003.jpg';

export const images = {
  narenAvatar,
  sitiAvatar,
  batik,
  gradevision,
  greenschool,
  mathhero,
  studyflow
};

const legacyImageUrls: Record<string, string> = {
  '/src/assets/images/avatar_naren_1790769156352.jpg': narenAvatar,
  '/src/assets/images/avatar_siti_1790769167757.jpg': sitiAvatar,
  '/src/assets/images/batik_mockup_1790769103394.jpg': batik,
  '/src/assets/images/gradevision_mockup_1790769090510.jpg': gradevision,
  '/src/assets/images/greenschool_preview_1790769064439.jpg': greenschool,
  '/src/assets/images/mathhero_mockup_1790769116801.jpg': mathhero,
  '/src/assets/images/studyflow_mockup_1790769077003.jpg': studyflow
};

export const resolveImageUrl = (url?: string) =>
  url ? legacyImageUrls[url] ?? url : '';