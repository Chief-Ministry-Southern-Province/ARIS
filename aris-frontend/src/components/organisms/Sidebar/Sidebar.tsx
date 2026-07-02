import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Shield, Home, LogOut, ChevronRight, X,} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {swalConfirm} from "@/utils/swal";

import { navItems } from "../../data/navigation";
import {useLogout} from "@/hooks/useAuth"

import { useAuth } from "@/context/auth/AuthContext";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (
    value: boolean
  ) => void;
}

export function Sidebar({mobileOpen,setMobileOpen,}: SidebarProps) {
  const { t } = useTranslation();

  const { role } = useAuth();
  //console.log("Role in sidebar:", role);
  
  const filteredNavItems = navItems.filter((item) =>
    item.roles.some((r) => role.includes(r[0].toLowerCase() + r.slice(1)))
  );

  const navigate = useNavigate();

  const [collapsed, setCollapsed] =
    useState(false);

  const {logoutUser} = useLogout();

  const handleLogout = async () => {
    
    const isConfirmed = await swalConfirm(
      "Logout",
      "Are you sure you want to logout?"
    );

    if (!isConfirmed) return;

    try {
      await logoutUser();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  // const [formsOpen, setFormsOpen] =
  //   useState(false);

  return (
    <>
      {/* Mobile Overlay */}

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() =>
            setMobileOpen(false)
          }
        />
      )}

      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-40 flex flex-col h-screen overflow-hidden bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          width: collapsed ? 72 : 260,
          background: "linear-gradient(180deg, #0F2460 0%, #1E3A8A 40%, #1E40AF 100%)",
          boxShadow: "4px 0 24px rgba(30,64,175,0.18)"
        }}
      >
        {/* Header */}

        <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border shrink-0"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sidebar-primary/20 border border-sidebar-primary/30 flex items-center justify-center">
              <Shield className="text-sidebar-primary" />
            </div>

            {!collapsed && (
              <div>
                <h2 className="font-bold text-sm">
                  ARIS
                </h2>

                <p className="text-xs text-white/80">
                  {t("app.name")}
                </p>
              </div>
            )}
          </div>

          {/* Mobile Close */}

          <button
            onClick={() =>
              setMobileOpen(false)
            }
            className="lg:hidden h-8 w-8 rounded-lg hover:bg-sidebar-accent flex items-center justify-center"
          >
            <X size={16} />
          </button>

          {/* Desktop Collapse */}

          <button
            onClick={() =>
              setCollapsed(!collapsed)
            }
            className="hidden lg:flex h-8 w-8 rounded-lg hover:bg-sidebar-accent items-center justify-center"
          >
            <ChevronRight
              size={16}
              className={
                collapsed
                  ? ""
                  : "rotate-180"
              }
            />
          </button>
        </div>

        {/* Ministry Badge */}

        {!collapsed && (
          <div className="mx-3 mt-3 p-3 rounded-xl bg-sidebar-primary/20 border border-sidebar-primary/30 shrink-0">
            <div className="flex gap-2">
              <Home
                size={16}
                className="text-warning"
              />

              <div>
                <p className="text-xs font-semibold">
                  Ministry of Health
                </p>

                <p className="text-xs text-white/80">
                  Government of Sri Lanka
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto hide-scrollbar p-3 space-y-1">
          {filteredNavItems.map((item) => {
            // if (item.children) {
            //   return (
            //     <div key={item.id}>
            //       <button
            //         onClick={() =>
            //           setFormsOpen(
            //             !formsOpen
            //           )
            //         }
            //         className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-sidebar-accent transition-colors"
            //       >
            //         <item.icon size={18} />

            //         {!collapsed && (
            //           <>
            //             <span className="flex-1 text-left">
            //               {t(
            //                 item.label
            //               )}
            //             </span>

            //             <ChevronDown
            //               size={16}
            //               className={
            //                 formsOpen
            //                   ? "rotate-180"
            //                   : ""
            //               }
            //             />
            //           </>
            //         )}
            //       </button>

            //       {!collapsed &&
            //         formsOpen && (
            //           <div className="ml-5 mt-1 border-l border-sidebar-border pl-3 space-y-1">
            //             {item.children.map(
            //               (
            //                 child
            //               ) => (
            //                 <NavLink
            //                   key={
            //                     child.id
            //                   }
            //                   to={
            //                     child.path
            //                   }
            //                   onClick={() =>
            //                     setMobileOpen(
            //                       false
            //                     )
            //                   }
            //                   className={({
            //                     isActive,
            //                   }) =>
            //                     `block px-3 py-2 rounded-lg text-sm transition-colors ${
            //                       isActive
            //                         ? "bg-sidebar-primary text-sidebar-primary-foreground"
            //                         : "hover:bg-sidebar-accent"
            //                     }`
            //                   }
            //                 >
            //                   {t(
            //                     child.label
            //                   )}
            //                 </NavLink>
            //               )
            //             )}
            //           </div>
            //         )}
            //     </div>
            //   );
            // }

            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
                title={
                  collapsed
                    ? t(
                        item.label
                      )
                    : undefined
                }
                className={({
                  isActive,
                }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "hover:bg-sidebar-accent"
                  } ${
                    collapsed
                      ? "justify-center"
                      : ""
                  }`
                }
              >
                <item.icon size={18} />

                {!collapsed && (
                  <span>
                    {t(
                      item.label
                    )}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}

        {!collapsed && (
          <div className="p-3 border-t border-sidebar-border shrink-0 bg-sidebar-primary/20 border ">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-sidebar-primary/20 border border-sidebar-primary/30">
              <div className="w-8 h-8 rounded-full bg-warning text-black flex items-center justify-center font-bold">
                A
              </div>

              <div className="min-w-0 ">
                <p className="text-xs font-semibold truncate">
                  Admin User
                </p>

                <p className="text-xs text-white/80 truncate">
                  System Administrator
                </p>
              </div>
            </div>

            <button className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors"
            onClick={() => {handleLogout()}}
            >
              <LogOut size={16} />

              {t("common.logout")}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}