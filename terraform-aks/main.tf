provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-minihotel-aks"
  location = "East US"
}

resource "azurerm_kubernetes_cluster" "aks" {
  name                = "minihotel-aks"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "minihotel"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_DC2s_v3"
  }

  identity {
    type = "SystemAssigned"
  }
}