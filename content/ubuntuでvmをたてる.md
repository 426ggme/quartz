---
title: UbuntuでVMをたてる
created: 2026-07-02 18:08:25
modified: 2026-07-02 18:08:25
description: null
tags: []
aliases:
  - "20260702180825"
---

# UbuntuでVMをたてる
[[KVM]] / [[QEMU]]を実行基盤として使い、[[libvirt]]をVMと仮想ネットワークの管理層として使う。設定の自動化や複数VMの構成を宣言管理することは、[[Terraform]]や[[Ansilbe]]によって後々実現する。

## KVM/QEMU + libvirtでVMを1台起動する
```bash
# packerges
sudo apt update

sudo apt install -y \
  qemu-kvm \
  libvirt-daemon-system \
  libvirt-clients \
  virtinst \
  virt-manager \
  virt-viewer \
  cpu-checker
# KVM
ls -l /dev/kvm
lsmod | grep kvm

# add user to group 
sudo usermod -aG libvirt,kvm "$USER"

# libvirt
virsh --connect qemu:///system uri
virsh --connect qemu:///system list --all
virsh --connect qemu:///system net-start default
virsh --connect qemu:///system net-autostart default

virsh --connect qemu:///system net-dumpxml default
ip addr show virbr0

# iso
sudo mkdir -p /var/lib/libvirt/boot

sudo cp \
  ~/Downloads/ubuntu-24.04.4-live-server-amd64.iso \
  /var/lib/libvirt/boot/
  
# make vm
virt-install \
  --connect qemu:///system \
  --name lab-node1 \
  --memory 2048 \
  --vcpus 2 \
  --cpu host-passthrough \
  --disk pool=default,size=15,format=qcow2,bus=virtio \
  --cdrom /var/lib/libvirt/boot/ubuntu-24.04.4-live-server-amd64.iso \
  --network network=default,model=virtio \
  --graphics spice \
  --video virtio \
  --osinfo detect=on,require=off \
  --noautoconsole
  
# view installer
virt-viewer \
  --connect qemu:///system \
  lab-node1
  
# poweroff vm
virsh --connect qemu:///system destroy lab-node1
virsh --connect qemu:///system list --all

virsh --connect qemu:///system domblklist \
  lab-node1 \
  --inactive \
  --details
  
# start vm
virsh --connect qemu:///system start lab-node1

# ssh
virsh --connect qemu:///system net-dhcp-leases default
ssh vmx@192.168.122.x

# check
virsh --connect qemu:///system dominfo lab-node1
virsh --connect qemu:///system domiflist lab-node1
virsh --connect qemu:///system domblklist lab-node1 --details

ip addr show virbr0
bridge link
```

