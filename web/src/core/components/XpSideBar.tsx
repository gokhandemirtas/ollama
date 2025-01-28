import { ArrowRightStartOnRectangleIcon, ChevronDownIcon, ChevronUpIcon, Cog8ToothIcon, HomeIcon, InboxIcon, LightBulbIcon, MagnifyingGlassIcon, PlusIcon, QuestionMarkCircleIcon, ShieldCheckIcon, SparklesIcon, Square2StackIcon, StarIcon, TicketIcon, UserIcon } from "@heroicons/react/16/solid";
import { Dropdown, DropdownButton, DropdownDivider, DropdownItem, DropdownLabel, DropdownMenu } from "./catalyst/dropdown";
import { Sidebar, SidebarBody, SidebarFooter, SidebarHeader, SidebarItem, SidebarLabel, SidebarSection, SidebarSpacer } from "./catalyst/sidebar";

import { Avatar } from "./catalyst/avatar";
import { BeakerIcon } from "@heroicons/react/24/solid";
import { CircleStackIcon } from "@heroicons/react/24/solid";
import { CursorArrowRaysIcon } from "@heroicons/react/24/solid";
import Logo from '../../assets/logo.png';
import MyAvatar from '../../assets/avatars/avatar1.png';
import { VariableIcon } from "@heroicons/react/24/solid";
import useHealthCheckStore from "../store/health-check.store";

export default function XpSideBar() {
  const { healthCheckResults } = useHealthCheckStore();
  return (
    <Sidebar>
      <SidebarHeader>
        <Dropdown>
          <DropdownButton as={SidebarItem} className="lg:mb-2.5">
            <Avatar src={Logo} square/>
            <SidebarLabel>Lorexplorer</SidebarLabel>
            <ChevronDownIcon />
          </DropdownButton>
          <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
            <DropdownItem href="/characters">
              <BeakerIcon />
              <DropdownLabel>My chars</DropdownLabel>
            </DropdownItem>
            <DropdownItem href="/designer">
              <SparklesIcon />
              <DropdownLabel>New character</DropdownLabel>
            </DropdownItem>
            <DropdownItem href="/uploads">
              <Square2StackIcon />
              <DropdownLabel>Uploads</DropdownLabel>
            </DropdownItem>
            <DropdownItem href="/new-upload">
              <TicketIcon />
              <DropdownLabel>New upload</DropdownLabel>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <SidebarSection className="max-lg:hidden">
          <SidebarItem href="/prompt">
            <MagnifyingGlassIcon />
            <SidebarLabel>Lore</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarHeader>
      <SidebarBody>
        <SidebarSection>
          <SidebarItem href="/characters">
            <BeakerIcon />
            <SidebarLabel>My chars</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/designer">
            <SparklesIcon />
            <SidebarLabel>New character</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/uploads">
            <Square2StackIcon />
            <SidebarLabel>Uploads</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/new-upload">
            <TicketIcon />
            <SidebarLabel>New upload</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
        <SidebarSpacer />
        <SidebarSection>
          <SidebarItem>
            <CircleStackIcon/>
            <SidebarLabel  className={healthCheckResults.isDbOnline ? "!text-green-500" : "!text-red-500 animate-pulse"} >DB</SidebarLabel>
          </SidebarItem>
          <SidebarItem>
            <VariableIcon/>
            <SidebarLabel className={healthCheckResults.isLLmOnline ? "!text-green-500" : "!text-red-500 animate-pulse"} >LM</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarBody>
      <SidebarFooter className="max-lg:hidden">
        <Dropdown>
          <DropdownButton as={SidebarItem}>
            <span className="flex min-w-0 items-center gap-3">
              <Avatar src={MyAvatar} className="size-10" square alt="" />
              <span className="min-w-0">
                <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">Erica</span>
                <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                  erica@example.com
                </span>
              </span>
            </span>
            <ChevronUpIcon />
          </DropdownButton>
          <DropdownMenu className="min-w-64" anchor="top start">
            <DropdownItem href="/logout">
              <ArrowRightStartOnRectangleIcon />
              <DropdownLabel>Sign out</DropdownLabel>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </SidebarFooter>
    </Sidebar>
  );
}
