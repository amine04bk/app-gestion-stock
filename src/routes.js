import UserAdd from "./views/Users/UserAdd";
import UserList from "./views/Users/UserList";
import RoleAdd from "./views/Roles/RoleAdd";
import RoleList from "./views/Roles/RoleList";
import RoleDetail from './views/Roles/RoleDetails';
import NotFound from "./views/NotFound";
import AddFournisseur from "./views/Fournisseur/AddFournisseur";
import ListFournisseur from "./views/Fournisseur/ListFournisseur";
import FournisseurDetail from './views/Fournisseur/FournisseurDetail';
import AddRessource from "./views/Ressource/AddRessource";
import ListRessource from "./views/Ressource/ListRessource";
import UserDetail from './views/Users/UserDetails';
import AddCategorie from "./views/Categorie/AddCategorie";
import ListCategorie from "./views/Categorie/ListCategorie";
import CategorieDetail from './views/Categorie/CategorieDetails';
import UserProfile from "./views/Users/UserProfile";
import RessourceDetail from './views/Ressource/RessourceDetails';
import AddEmplacement from "./views/Emplacement/AddEmplacement";
import ListEmplacement from "./views/Emplacement/ListEmplacement";
import EmplacementDetail from './views/Emplacement/EmplacementDetails';
import ListCommande from "./views/Commande/CommandeList";
import AddCommande from "./views/Commande/AddCommande";
import DetailCommande from "./views/Commande/DetailCommande";
import DetailFacture from "./views/Facture/DetailFacture";
import AddFacture from "./views/Facture/AddFacture";
import ListFacture from "./views/Facture/FactureList";

const dashboardRoutes = [

  {
    path: "/user/add",
    name: "User add",
    icon: "nc-icon nc-circle-09",
    component: UserAdd,
    componentStr: "UserAdd",
    id_role: "1,2",
    className: "hidden"
  },
  
  {
    path: "/user/update/:id",
    name: "User add",
    icon: "nc-icon nc-circle-09",
    component: UserAdd,
    componentStr: "UserAdd",
    id_role: "1,2",
    className: "hidden"
  },
  {
    path: "/user/list",
    name: "User",
    icon: "fa-solid fa-users",
    component: UserList,
    id_role: "1,2",
    componentStr: "UserList",
  },

  {
    path: "/role/add",
    name: "Role add",
    icon: "nc-icon nc-circle-09",
    component: RoleAdd,
    componentStr: "RoleAdd",
    id_role: "1,2",
    className: "hidden"
  },
  {
    path: "/role/update/:id",
    name: "Role add",
    icon: "nc-icon nc-circle-09",
    component: RoleAdd,
    componentStr: "RoleAdd",
    id_role: "1,2",
    className: "hidden"
  },
  {
    path: "/user/detail/:id",
    name: "User",
    icon: "fa-solid fa-users",
    component: UserDetail,
    id_role: "1,2",
    componentStr: "UserDetail",
    className: "hidden"
  },
  {
    path: "/role/list",
    name: "Role",
    icon: "fas fa-user-cog",
    component: RoleList,
    id_role: "1,2",
    componentStr: "RoleList",
  },

  {
    path: "/role/detail/:id",
    name: "Role",
    icon: "fa-solid fa-users",
    component: RoleDetail,
    id_role: "1,2",
    componentStr: "RoleDetail",
    className: "hidden"
  },
  //Fournisseur
  {
    path: "/fournisseur/add",
    name: "Fournisseur add",
    icon: "nc-icon nc-circle-09",
    component: AddFournisseur,
    componentStr: "AddFournisseur",
    id_role: "1,3",
    className: "hidden"
  },
  {
    path: "/fournisseur/update/:id",
    name: "User add",
    icon: "nc-icon nc-circle-09",
    component: AddFournisseur,
    componentStr: "AddFournisseur",
    id_role: "1,3",
    className: "hidden"
  },
  {
    path: "/fournisseur/list",
    name: "Fournisseur",
    icon: "fa-solid fa-dumpster-fire",
    component: ListFournisseur,
    id_role: "1,3",
    componentStr: "ListFournisseur",
  },
  {
    path: "/fournisseur/detail/:id",
    name: "Fournisseur",
    icon: "fa-solid fa-users",
    component: FournisseurDetail,
    id_role: "1,3",
    componentStr: "FournisseurDetail",
    className: "hidden"
  },
  {
    path: "/ressource/add",
    name: "Ressource add",
    icon: "nc-icon nc-circle-09",
    component: AddRessource,
    componentStr: "AddRessource",
    id_role: "1,3",
    className: "hidden"
  },
  {
    path: "/ressource/update/:id",
    name: "User add",
    icon: "nc-icon nc-circle-09",
    component: AddRessource,
    componentStr: "AddRessource",
    id_role: "1,3",
    className: "hidden"
  },
  {
    path: "/ressource/list",
    name: "Ressource",
    icon: "fa-solid fa-rupee-sign",
    component: ListRessource,
    id_role: "1,3",
    componentStr: "ListRessource",
  },
  {
    path: "/ressource/detail/:id",
    name: "Ressource",
    icon: "fa-solid fa-users",
    component: RessourceDetail,
    id_role: "1,3",
    componentStr: "RessourceDetail",
    className: "hidden"
  },

  
  {
    path: "/commande/list",
    name: "commande",
    icon: "fa-solid fa-file-invoice-dollar",
    component: ListCommande,
    id_role: "1,3",
    componentStr: "ListCommande",
  },
  {
    path: "/commande/add",
    name: "Commancde add",
    icon: "nc-icon nc-circle-09",
    component: AddCommande,
    componentStr: "AddCommande",
    id_role: "1,3",
    className: "hidden"
  },
  {
    path: "/commande/update/:id",
    name: "commande add",
    icon: "nc-icon nc-circle-09",
    component: AddCommande,
    componentStr: "AddCommande",
    id_role: "1,3",
    className: "hidden"
  },
  {
    path: "/commande/detail/:id",
    name: "commande add",
    icon: "nc-icon nc-circle-09",
    component: DetailCommande,
    componentStr: "DetailCommande",
    id_role: "1,3",
    className: "hidden"
  },

  {
    path: "/categorie/add",
    name: "User add",
    icon: "nc-icon nc-circle-09",
    component: AddCategorie,
    componentStr: "AddCategorie",
    id_role: "1,3",
    className: "hidden"
  },
  {
    path: "/categorie/update/:id",
    name: "User add",
    icon: "nc-icon nc-circle-09",
    component: AddCategorie,
    componentStr: "AddCategorie",
    id_role: "1,3",
    className: "hidden"
  },
  {
    path: "/categorie/detail/:id",
    name: "Categorie",
    icon: "fa-solid fa-users",
    component: CategorieDetail,
    id_role: "1,3",
    componentStr: "CategorieDetail",
    className: "hidden"
  },
 
  {
    path: "/categorie/list",
    name: "Categorie",
    icon: "fa-solid fa-network-wired",
    component: ListCategorie,
    id_role: "1,3",
    componentStr: "ListCategorie",
  },

  {
    path: "/emplacement/add",
    name: "emplacement add",
    icon: "nc-icon nc-circle-09",
    component: AddEmplacement,
    componentStr: "AddEmplacement",
    id_role: "1,3",
    className: "hidden"
  },
  {
    path: "/emplacement/update/:id",
    name: "emplacement add",
    icon: "nc-icon nc-circle-09",
    component: AddEmplacement,
    componentStr: "AddEmplacement",
    id_role: "1,3",
    className: "hidden"
  },
  {
    path: "/emplacement/detail/:id",
    name: "emplacement",
    icon: "fa-solid fa-users",
    component: EmplacementDetail,
    id_role: "1,3",
    componentStr: "EmplacementDetail",
    className: "hidden"
  },
  {
    path: "/emplacement/list",
    name: "Emplacement",
    icon: "fa-duotone fa-solid fa-layer-group",
    component: ListEmplacement,
    id_role: "1,3",
    componentStr: "ListEmplacement",
  },


  {
    path: "/facture/list",
    name: "facture",
    icon: "fa-solid fa-file-invoice",
    component: ListFacture,
    id_role: "1,3",
    componentStr: "ListFacture",
  },
  {
    path: "/facture/add",
    name: "Facture add",
    icon: "nc-icon nc-circle-09",
    component: AddFacture,
    componentStr: "AddFacture",
    id_role: "1,3",
    className: "hidden"
  },
  //FACTURE
  {
    path: "/facture/update/:id",
    name: "facture add",
    icon: "nc-icon nc-circle-09",
    component: AddFacture,
    componentStr: "AddFacture",
    id_role: "1,3",
    className: "hidden"
  },
  {
    path: "/facture/detail/:id",
    name: "facture add",
    icon: "nc-icon nc-circle-09",
    component: DetailFacture,
    componentStr: "DetailFacture",
    id_role: "1,3",
    className: "hidden"
  },

  {
    path: "/profile",
    name: "Profile",
    icon: "fa-solid fa-store",
    component: UserProfile,
    componentStr: "UserProfile",
    id_role: "1,2,3",
    className: "hidden"
  },

  
];

export default dashboardRoutes;
