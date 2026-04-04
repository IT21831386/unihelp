const AreaLayout = require('../models/AreaLayout');

const defaultLayoutConfigs = {
  canteen: {
    label: 'Canteen',
    layoutConfig: {
      left: [
        { id: 'C1', label: 'Family T1', rows: [['C1-1', 'C1-2', 'C1-3'], ['C1-4', 'C1-5', 'C1-6']] },
        { id: 'C2', label: 'Family T2', rows: [['C2-1', 'C2-2', 'C2-3'], ['C2-4', 'C2-5', 'C2-6']] },
      ],
      right: [
        { id: 'C3', label: 'Booth A', rows: [['C3-1', 'C3-2', 'C3-3', 'C3-4']] },
        { id: 'C4', label: 'Booth B', rows: [['C4-1', 'C4-2', 'C4-3', 'C4-4']] },
        { id: 'C5', label: 'Booth C', rows: [['C5-1', 'C5-2', 'C5-3', 'C5-4']] },
      ],
    }
  },
  'study-area': {
    label: 'Study area',
    layoutConfig: {
      left: [
        { id: 'TA', label: 'TA', rows: [['TA1', 'TA2', 'TA3'], ['TA4', 'TA5', 'TA6']] },
        { id: 'TB', label: 'TB', rows: [['TB1', 'TB2', 'TB3'], ['TB4', 'TB5', 'TB6']] },
        { id: 'TC', label: 'TC', rows: [['TC1', 'TC2', 'TC3'], ['TC4', 'TC5', 'TC6']] },
      ],
      right: [
        { id: 'TD', label: 'TD', rows: [['TD1', 'TD2', 'TD3', 'TD4'], ['TD5', 'TD6', 'TD7', 'TD8']] },
        { id: 'TE', label: 'TE', rows: [['TE1', 'TE2', 'TE3'], ['TE4', 'TE5', 'TE6']] },
        { id: 'TF', label: 'TF', rows: [['TF1', 'TF2', 'TF3'], ['TF4', 'TF5', 'TF6']] },
      ],
    }
  },
  library: {
    label: 'Library',
    layoutConfig: {
      left: [
        { id: 'L1', label: 'Pod 1', rows: [['L1-1'], ['L1-2']] },
        { id: 'L2', label: 'Pod 2', rows: [['L2-1'], ['L2-2']] },
        { id: 'L3', label: 'Pod 3', rows: [['L3-1'], ['L3-2']] },
        { id: 'L4', label: 'Pod 4', rows: [['L4-1'], ['L4-2']] },
      ],
      right: [
        { id: 'L5', label: 'Desk A', rows: [['L5-1', 'L5-2', 'L5-3'], ['L5-4', 'L5-5', 'L5-6']] },
        { id: 'L6', label: 'Desk B', rows: [['L6-1', 'L6-2', 'L6-3'], ['L6-4', 'L6-5', 'L6-6']] },
      ],
    }
  }
};

const getAreas = async (req, res) => {
  try {
    let areas = await AreaLayout.find();
    
    // Seed them if none exist
    if (areas.length === 0) {
      const keys = Object.keys(defaultLayoutConfigs);
      for (const k of keys) {
        await AreaLayout.create({ categoryId: k, ...defaultLayoutConfigs[k] });
      }
      areas = await AreaLayout.find();
    }
    
    res.json(areas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateArea = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { label, layoutConfig } = req.body;
    
    let area = await AreaLayout.findOne({ categoryId });
    if (!area) {
      area = new AreaLayout({ categoryId, label, layoutConfig });
    } else {
      area.label = label || area.label;
      if (layoutConfig) area.layoutConfig = layoutConfig;
    }
    
    await area.save();
    res.json(area);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAreas, updateArea };
